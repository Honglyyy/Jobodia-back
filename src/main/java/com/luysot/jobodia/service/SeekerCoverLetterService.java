package com.luysot.jobodia.service;

import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerCoverLetterResponseDto;
import com.luysot.jobodia.exception.InvalidRequestException;
import com.luysot.jobodia.exception.ResourceNotFoundException;
import com.luysot.jobodia.model.SeekerCoverLetters;
import com.luysot.jobodia.model.SeekerProfiles;
import com.luysot.jobodia.model.Users;
import com.luysot.jobodia.repository.SeekerCoverLetterRepository;
import com.luysot.jobodia.repository.SeekerProfileRepository;
import com.luysot.jobodia.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SeekerCoverLetterService {
    private final SeekerCoverLetterRepository seekerCoverLetterRepository;
    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private static final List<String> ALLOWED_TYPES = List.of(
            "application/pdf"
    );

    public void uploadSeekerCoverLetter(
            String email,
            String title,
            MultipartFile file) throws IOException {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        SeekerProfiles seekerProfiles = seekerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seeker profile not found"));

        if (file.isEmpty()) {
            throw new InvalidRequestException("Cover letter file is required");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !ALLOWED_TYPES.contains(contentType)) {

            throw new InvalidRequestException(
                    "Only PDF files are allowed");
        }

        String uploadDir =
                "uploads/seeker-cover-letter/" + user.getUsername();

        File dir = new File(uploadDir);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        Path uploadPath = Paths.get(uploadDir);

        String originalName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String storedName =
                UUID.randomUUID()
                        + "_("
                        + user.getUsername()
                        + ")_"
                        + originalName;

        Path path = uploadPath.resolve(storedName);

        file.transferTo(path);

        SeekerCoverLetters seekerCoverLetter = new SeekerCoverLetters();

        seekerCoverLetter.setTitle(title);
        seekerCoverLetter.setCoverLetterOriginalName(originalName);
        seekerCoverLetter.setCoverLetterStoredName(storedName);
        seekerCoverLetter.setCoverLetterContentType(contentType);

        seekerCoverLetter.setSeeker(seekerProfiles);

        SeekerCoverLetters saved =
                seekerCoverLetterRepository.save(seekerCoverLetter);

        saved.setCoverLetterUrl(
                "/api/v1/seeker-cover-letters/"
                        + saved.getId()
                        + "/file"
        );

        seekerCoverLetterRepository.save(saved);
    }

    public Page<SeekerCoverLetterResponseDto> findAllSeekerOwnCoverLetter(String email, Pageable pageable) {
        Users user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SeekerProfiles seekerProfiles = seekerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seeker profile not found"));

        return seekerCoverLetterRepository.findBySeeker(seekerProfiles, pageable).map(coverLetter -> SeekerCoverLetterResponseDto.builder()
                        .id(coverLetter.getId())
                        .title(coverLetter.getTitle())
                        .coverLetterUrl(coverLetter.getCoverLetterUrl())
                        .build());
    }

    public SeekerCoverLetterResponseDto findSeekerOwnCoverLetter(Long id,String email){
        return toCoverLetterResponse(findSeekerOwnCoverLetterEntity(id, email));
    }

    public SeekerCoverLetters findSeekerOwnCoverLetterEntity(Long id, String email) {
        Users user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SeekerProfiles seekerProfiles = seekerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seeker profile not found"));
        return seekerCoverLetterRepository.findByIdAndSeeker(id,seekerProfiles).orElseThrow(() -> new ResourceNotFoundException("Cover letter not found"));
    }

    public Resource loadSeekerOwnCoverLetterFile(Long id, String email) throws MalformedURLException, FileNotFoundException {
        SeekerCoverLetters coverLetter = findSeekerOwnCoverLetterEntity(id, email);
        String storedName = coverLetter.getCoverLetterStoredName();
        if (storedName == null || storedName.isBlank()) {
            throw new FileNotFoundException("Cover letter file not found");
        }

        Path path = Paths.get("uploads")
                .resolve("seeker-cover-letter")
                .resolve(coverLetter.getSeeker().getUser().getUsername())
                .resolve(storedName);

        if (!Files.exists(path)) {
            throw new FileNotFoundException("Cover letter file not found");
        }

        return new UrlResource(path.toUri());
    }

    private SeekerCoverLetterResponseDto toCoverLetterResponse(SeekerCoverLetters coverLetter) {
        return SeekerCoverLetterResponseDto.builder()
                .id(coverLetter.getId())
                .title(coverLetter.getTitle())
                .coverLetterUrl(coverLetter.getCoverLetterUrl())
                .build();
    }

    @Transactional
    public void deleteSeekerOwnCoverLetter(Long id, String email){
        Users user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SeekerProfiles seekerProfiles = seekerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seeker profile not found"));
        seekerCoverLetterRepository.findByIdAndSeeker(id, seekerProfiles)
                .orElseThrow(() -> new ResourceNotFoundException("Cover letter not found"));
        seekerCoverLetterRepository.deleteByIdAndSeeker(id,seekerProfiles);
    }
}
