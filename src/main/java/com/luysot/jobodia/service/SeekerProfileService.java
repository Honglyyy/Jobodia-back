package com.luysot.jobodia.service;

import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerProfileRequestDto;
import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerProfileResponseDto;
import com.luysot.jobodia.mapper.SeekerProfileMapper;
import com.luysot.jobodia.model.SeekerProfile;
import com.luysot.jobodia.model.Users;
import com.luysot.jobodia.repository.SeekerProfileRepository;
import com.luysot.jobodia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SeekerProfileService {
    private final SeekerProfileRepository seekerProfileRepository;
    private final SeekerProfileMapper seekerProfileMapper;
    private final UserRepository userRepository;

    private static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/avif",
            "image/webp"
    );

    public SeekerProfileResponseDto createProfile(SeekerProfileRequestDto request, String email){
        Users user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User by the following email is not found!"));

        if(seekerProfileRepository.findByUser(user).isPresent()){
            throw new RuntimeException("Profile already exists!");
        }

        SeekerProfile seekerProfile = new SeekerProfile();

        seekerProfile.setPhoneNumber(request.phoneNumber());
        seekerProfile.setGender(request.gender());
        seekerProfile.setUser(user);

        SeekerProfile savedProfile = seekerProfileRepository.save(seekerProfile);

        return seekerProfileMapper.toDto(savedProfile);
    }

    public void uploadProfilePicture(String email, MultipartFile file) throws IOException {
        Users user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User by the following email is not found!"));

        SeekerProfile profile = seekerProfileRepository.findByUser(user).orElseThrow(()->new RuntimeException("User is not found"));

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            return;
        }

        String uploadDir = "uploads/seekerProfile";
        File dir = new File(uploadDir);

        if(!dir.exists()) dir.mkdirs();

        Path uploadPath = Paths.get(uploadDir);
        String storedName = UUID.randomUUID() + "_" + "(" + user.getUsername() + ")" +file.getOriginalFilename();
        Path path = uploadPath.resolve(storedName);

        file.transferTo(path);

        profile.setProfilePictureContentType(contentType);
        profile.setProfilePictureOriginalName(file.getOriginalFilename());
        profile.setProfilePictureStoredName(storedName);
        profile.setProfilePictureUrl("/api/v1/seeker-profile/" + user.getId() + "/profile-picture");

        seekerProfileRepository.save(profile);
    }
}
