package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerResumeResponseDto;
import com.luysot.jobodia.model.SeekerResumes;
import com.luysot.jobodia.service.SeekerResumeService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.io.FileNotFoundException;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v1/seeker-resumes")
public class SeekerResumeController {
    private final SeekerResumeService seekerResumeService;

    @PostMapping
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<?> uploadSeekerResume(
            @RequestParam @NotBlank(message = "Title is required")
            @Size(max = 255, message = "Title cannot exceed 255 characters")
            String title,
            @RequestParam MultipartFile file,
            Authentication authentication
    ) throws IOException {
        seekerResumeService.uploadSeekerResume(
                authentication.getName(),
                title,
                file
        );
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<Page<SeekerResumeResponseDto>> findAllSeekerOwnResume(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        return ResponseEntity.ok(seekerResumeService.findAllSeekerOwnResume(authentication.getName(), pageable));
    }

    @GetMapping({"/{id}", "/me/{id}"})
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<SeekerResumeResponseDto> findSeekerOwnResume(@PathVariable @Positive(message = "Resume id must be positive") Long id, Authentication authentication){
        return ResponseEntity.ok(seekerResumeService.findSeekerOwnResume(id,authentication.getName()));
    }

    @GetMapping({"/{id}/file", "/me/{id}/file"})
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<Resource> downloadSeekerOwnResume(
            @PathVariable @Positive(message = "Resume id must be positive") Long id,
            Authentication authentication
    ) throws MalformedURLException, FileNotFoundException {
        SeekerResumes resume = seekerResumeService.findSeekerOwnResumeEntity(id, authentication.getName());
        Resource resource = seekerResumeService.loadSeekerOwnResumeFile(id, authentication.getName());

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(resume.getResumeContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(resume.getResumeOriginalName())
                                .build()
                                .toString())
                .body(resource);
    }

    @DeleteMapping({"/{id}", "/me/{id}"})
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<?> deleteSeekerOwnResume(@PathVariable @Positive(message = "Resume id must be positive") Long id, Authentication authentication){
        seekerResumeService.deleteSeekerOwnResume(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
