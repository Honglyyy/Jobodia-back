package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.ApplicationDTOs.ApplicationRequestDto;
import com.luysot.jobodia.dto.ApplicationDTOs.ApplicationResponseDto;
import com.luysot.jobodia.dto.ApplicationDTOs.UpdateApplicationStatusRequestDto;
import com.luysot.jobodia.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/applications")
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<ApplicationResponseDto> apply(Authentication authentication,@Valid @RequestBody ApplicationRequestDto request)
    {
        return ResponseEntity.ok(applicationService.apply(authentication.getName(),request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<List<ApplicationResponseDto>> findSeekerOwnApplications(Authentication authentication){
        return ResponseEntity.ok(applicationService.findSeekerOwnApplications(authentication.getName()));
    }

    @GetMapping("/me/{id}")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<ApplicationResponseDto> findSeekerOwnApplication(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(applicationService.findSeekerOwnApplication(id,authentication.getName()));
    }

    @DeleteMapping("/me/{id}")
    @PreAuthorize("hasRole('SEEKER')")
    ResponseEntity<String> deleteSeekerOwnApplication(@PathVariable Long id, Authentication authentication){
        applicationService.deleteSeekerOwnApplication(id, authentication.getName());
        return ResponseEntity.ok("Application deleted.");
    }

    @GetMapping("/applicants")
    @PreAuthorize("hasRole('EMPLOYER')")
    ResponseEntity<List<ApplicationResponseDto>> findApplicants(Authentication authentication){
        return ResponseEntity.ok(applicationService.findApplicants(authentication.getName()));
    }

    @GetMapping("/applicants/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    ResponseEntity<ApplicationResponseDto> findApplicant(@PathVariable Long id,Authentication authentication){
        return ResponseEntity.ok(applicationService.findApplicant(id,authentication.getName()));
    }

    @PatchMapping("/applicants/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    ResponseEntity<ApplicationResponseDto> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequestDto reqStatus,
            Authentication authentication){
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id,reqStatus,authentication.getName()));
    }
}
