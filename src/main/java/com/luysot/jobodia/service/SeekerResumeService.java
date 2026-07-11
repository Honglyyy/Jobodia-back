package com.luysot.jobodia.service;

import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerResumeResponseDto;
import com.luysot.jobodia.exception.InvalidRequestException;
import com.luysot.jobodia.exception.ResourceNotFoundException;
import com.luysot.jobodia.model.SeekerProfiles;
import com.luysot.jobodia.model.SeekerResumes;
import com.luysot.jobodia.model.Users;
import com.luysot.jobodia.repository.SeekerProfileRepository;
import com.luysot.jobodia.repository.SeekerResumeRepository;
import com.luysot.jobodia.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

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
public class SeekerResumeService {
    private final SeekerResumeRepository seekerResumeRepository;
    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private static final List<String> ALLOWED_TYPES = List.of(
            "application/pdf"
    );

    public void uploadSeekerResume(
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
            throw new InvalidRequestException("Resume file is required");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !ALLOWED_TYPES.contains(contentType)) {

            throw new InvalidRequestException(
                    "Only PDF files are allowed");
        }

        String uploadDir =
                "uploads/seeker-resume/" + user.getUsername();

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

        SeekerResumes seekerResume = new SeekerResumes();

        seekerResume.setTitle(title);
        seekerResume.setResumeOriginalName(originalName);
        seekerResume.setResumeStoredName(storedName);
        seekerResume.setResumeContentType(contentType);

        seekerResume.setSeeker(seekerProfiles);

        SeekerResumes saved =
                seekerResumeRepository.save(seekerResume);

        saved.setResumeUrl(
                "/api/v1/seeker-resumes/"
                        + saved.getId()
                        + "/file"
        );

        seekerResumeRepository.save(saved);
    }

    public Page<SeekerResumeResponseDto> findAllSeekerOwnResume(String email, Pageable pageable) {
        Users user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SeekerProfiles seekerProfiles = seekerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seeker profile not found"));

        return seekerResumeRepository.findBySeeker(seekerProfiles, pageable).map(resume -> SeekerResumeResponseDto.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .resumeUrl(resume.getResumeUrl())
                .build());
    }

    public SeekerResumeResponseDto findSeekerOwnResume(Long id,String email){
        return toResumeResponse(findSeekerOwnResumeEntity(id, email));
    }

    public SeekerResumes findSeekerOwnResumeEntity(Long id, String email) {
        Users user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SeekerProfiles seekerProfiles = seekerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seeker profile not found"));
        return seekerResumeRepository.findByIdAndSeeker(id,seekerProfiles).orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
    }

    public Resource loadSeekerOwnResumeFile(Long id, String email) throws MalformedURLException, FileNotFoundException {
        SeekerResumes resume = findSeekerOwnResumeEntity(id, email);
        String storedName = resume.getResumeStoredName();
        if (storedName == null || storedName.isBlank()) {
            throw new FileNotFoundException("Resume file not found");
        }

        Path path = Paths.get("uploads")
                .resolve("seeker-resume")
                .resolve(resume.getSeeker().getUser().getUsername())
                .resolve(storedName);

        if (!Files.exists(path)) {
            throw new FileNotFoundException("Resume file not found");
        }

        return new UrlResource(path.toUri());
    }

    private SeekerResumeResponseDto toResumeResponse(SeekerResumes resume) {
        return SeekerResumeResponseDto.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .resumeUrl(resume.getResumeUrl())
                .build();
    }

    @Transactional
    public void deleteSeekerOwnResume(Long id, String email){
        Users user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SeekerProfiles seekerProfiles = seekerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seeker profile not found"));
        seekerResumeRepository.findByIdAndSeeker(id, seekerProfiles)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        seekerResumeRepository.deleteByIdAndSeeker(id,seekerProfiles);
    }
}
