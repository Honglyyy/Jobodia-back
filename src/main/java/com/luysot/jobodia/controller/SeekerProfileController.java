package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerProfileRequestDto;
import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerProfileResponseDto;
import com.luysot.jobodia.service.SeekerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/seeker-profiles")
public class SeekerProfileController {
    private final SeekerProfileService seekerProfileService;

    @PostMapping
    ResponseEntity<SeekerProfileResponseDto> createProfile(
            @RequestBody SeekerProfileRequestDto dto,
            Authentication authentication
            ){
        return ResponseEntity.ok(seekerProfileService.createProfile(dto,authentication.getName()));
    }

    @PostMapping("/picture")
    ResponseEntity<?> uploadProfilePicture(
            @RequestParam MultipartFile file,
            Authentication authentication
            ) throws IOException {
        seekerProfileService.uploadProfilePicture(authentication.getName(),file);
        return ResponseEntity.ok("Uploaded");
    }
}
