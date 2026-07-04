package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.JobDTOs.JobRequestDto;
import com.luysot.jobodia.dto.JobDTOs.JobResponseDto;
import com.luysot.jobodia.model.Jobs;
import com.luysot.jobodia.model.enums.JobLevel;
import com.luysot.jobodia.model.enums.JobSite;
import com.luysot.jobodia.model.enums.JobTime;
import com.luysot.jobodia.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/jobs")
public class JobController {
    private final JobService jobService;

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    ResponseEntity<JobResponseDto> addJob(@Valid @RequestBody JobRequestDto request, Authentication authentication){
        return ResponseEntity.ok(jobService.addJob(authentication.getName(),request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    ResponseEntity<JobResponseDto> updateJob(@Valid @PathVariable Long id,@RequestBody JobRequestDto request, Authentication authentication){
        return ResponseEntity.ok(jobService.updateJob(id,request,authentication.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    ResponseEntity<?> deleteJob(@PathVariable Long id, Authentication authentication){
        jobService.deleteJob(id,authentication.getName());
        return ResponseEntity.ok("Job deleted");
    }

    @GetMapping
    ResponseEntity<List<JobResponseDto>> findJobs(){
        return ResponseEntity.ok(jobService.findJobs());
    }

    @GetMapping("/search")
    ResponseEntity<List<JobResponseDto>> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String category,
            @RequestParam(required = false)JobTime jobTime,
            @RequestParam(required = false) JobLevel jobLevel,
            @RequestParam(required = false) JobSite jobSite
            ){
        return ResponseEntity.ok(jobService.searchJob(
                title,industry,company, category,jobTime, jobLevel,jobSite
        ));
    }

    @GetMapping("/newly-added")
    ResponseEntity<List<JobResponseDto>> findNewlyAddedJobs(){
        return ResponseEntity.ok(jobService.findNewlyAddedJob());
    }

    @GetMapping("/{id}")
    ResponseEntity<JobResponseDto> findJob(@PathVariable Long id){
        return ResponseEntity.ok(jobService.findJob(id));
    }


    @GetMapping("/me")
    ResponseEntity<Set<JobResponseDto>> findOwnEmployerJobs(Authentication authentication){
        return ResponseEntity.ok(jobService.findOwnEmployerJobs(authentication.getName()));
    }

    @GetMapping("/{id}/me")
    ResponseEntity<JobResponseDto> findOwnEmployerJob(Authentication authentication,@PathVariable Long id){
        return ResponseEntity.ok(jobService.findOwnEmployerJob(authentication.getName(), id));
    }
}
