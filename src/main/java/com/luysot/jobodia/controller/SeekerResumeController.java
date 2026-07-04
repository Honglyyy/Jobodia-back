package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerResumeResponseDto;
import com.luysot.jobodia.service.SeekerResumeService;
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
@RequestMapping("/api/v1/seeker-resumes")
public class SeekerResumeController {
    private final SeekerResumeService seekerResumeService;

    @PostMapping
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<?> uploadSeekerResume(
            @RequestParam String title,
            @RequestParam MultipartFile file,
            Authentication authentication
            ) throws IOException {
        seekerResumeService.uploadSeekerResume(
                authentication.getName(),
                title,
                file
        );
        return ResponseEntity.ok("Resume uploaded!!");
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<Page<SeekerResumeResponseDto>> findAllSeekerOwnResume(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        return ResponseEntity.ok(seekerResumeService.findAllSeekerOwnResume(authentication.getName(), pageable));
    }

    @GetMapping("/me/{id}")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<SeekerResumeResponseDto> findSeekerOwnResume(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(seekerResumeService.findSeekerOwnResume(id,authentication.getName()));
    }

    @DeleteMapping("/me/{id}")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<?> deleteSeekerOwnResume(@PathVariable Long id, Authentication authentication){
        seekerResumeService.deleteSeekerOwnResume(id, authentication.getName());
        return ResponseEntity.ok("Resume deleted!");
    }
}
