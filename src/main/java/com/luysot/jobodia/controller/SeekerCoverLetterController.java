package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerCoverLetterResponseDto;
import com.luysot.jobodia.service.SeekerCoverLetterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/seeker-cover-letters")
public class SeekerCoverLetterController {
    private final SeekerCoverLetterService seekerCoverLetterService;

    @PostMapping
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<?> uploadSeekerCoverLetter(
            @RequestParam String title,
            @RequestParam MultipartFile file,
            Authentication authentication
            ) throws IOException {
        seekerCoverLetterService.uploadSeekerCoverLetter(
                authentication.getName(),
                title,
                file
        );
        return ResponseEntity.ok("Cover letter uploaded!!");
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<Page<SeekerCoverLetterResponseDto>> findAllSeekerOwnCoverLetter(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        return ResponseEntity.ok(seekerCoverLetterService.findAllSeekerOwnCoverLetter(authentication.getName(), pageable));
    }

    @GetMapping("/me/{id}")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<SeekerCoverLetterResponseDto> findSeekerOwnCoverLetter(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(seekerCoverLetterService.findSeekerOwnCoverLetter(id,authentication.getName()));
    }

    @DeleteMapping("/me/{id}")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<?> deleteSeekerOwnCoverLetter(@PathVariable Long id, Authentication authentication){
        seekerCoverLetterService.deleteSeekerOwnCoverLetter(id, authentication.getName());
        return ResponseEntity.ok("Cover letter deleted!");
    }
}
