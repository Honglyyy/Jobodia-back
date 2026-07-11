package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerCoverLetterResponseDto;
import com.luysot.jobodia.model.SeekerCoverLetters;
import com.luysot.jobodia.service.SeekerCoverLetterService;
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
import java.io.FileNotFoundException;
import java.net.MalformedURLException;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v1/seeker-cover-letters")
public class SeekerCoverLetterController {
    private final SeekerCoverLetterService seekerCoverLetterService;

    @PostMapping
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<?> uploadSeekerCoverLetter(
            @RequestParam @NotBlank(message = "Title is required")
            @Size(max = 255, message = "Title cannot exceed 255 characters")
            String title,
            @RequestParam MultipartFile file,
            Authentication authentication
    ) throws IOException {
        seekerCoverLetterService.uploadSeekerCoverLetter(
                authentication.getName(),
                title,
                file
        );
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<Page<SeekerCoverLetterResponseDto>> findAllSeekerOwnCoverLetter(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        return ResponseEntity.ok(seekerCoverLetterService.findAllSeekerOwnCoverLetter(authentication.getName(), pageable));
    }

    @GetMapping({"/{id}", "/me/{id}"})
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<SeekerCoverLetterResponseDto> findSeekerOwnCoverLetter(@PathVariable @Positive(message = "Cover letter id must be positive") Long id, Authentication authentication){
        return ResponseEntity.ok(seekerCoverLetterService.findSeekerOwnCoverLetter(id,authentication.getName()));
    }

    @GetMapping({"/{id}/file", "/me/{id}/file"})
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<Resource> downloadSeekerOwnCoverLetter(
            @PathVariable @Positive(message = "Cover letter id must be positive") Long id,
            Authentication authentication
    ) throws MalformedURLException, FileNotFoundException {
        SeekerCoverLetters coverLetter = seekerCoverLetterService.findSeekerOwnCoverLetterEntity(id, authentication.getName());
        Resource resource = seekerCoverLetterService.loadSeekerOwnCoverLetterFile(id, authentication.getName());

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(coverLetter.getCoverLetterContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(coverLetter.getCoverLetterOriginalName())
                                .build()
                                .toString())
                .body(resource);
    }

    @DeleteMapping({"/{id}", "/me/{id}"})
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<?> deleteSeekerOwnCoverLetter(@PathVariable @Positive(message = "Cover letter id must be positive") Long id, Authentication authentication){
        seekerCoverLetterService.deleteSeekerOwnCoverLetter(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
