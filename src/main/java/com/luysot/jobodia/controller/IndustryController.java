package com.luysot.jobodia.controller;


import com.luysot.jobodia.dto.IndustryDTOs.IndustryRequestDto;
import com.luysot.jobodia.dto.IndustryDTOs.IndustryResponseDto;
import com.luysot.jobodia.service.IndustryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/industries")
public class IndustryController {
    private final IndustryService industryService;

    @GetMapping
    ResponseEntity<Set<IndustryResponseDto>> findIndustries(){
        return ResponseEntity.ok(industryService.findIndustries());
    }

    @GetMapping("/{id}")
    ResponseEntity<IndustryResponseDto> findIndustry(@PathVariable Long id){
        return ResponseEntity.ok(industryService.findIndustry(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<IndustryResponseDto> addIndustry(@Valid @RequestBody IndustryRequestDto dto){
        return ResponseEntity.ok(industryService.addIndustry(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<IndustryResponseDto> updateIndustry(@PathVariable Long id, @Valid @RequestBody IndustryRequestDto dto){
        return ResponseEntity.ok(industryService.updateIndustry(id,dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<?> deleteIndustry(@PathVariable Long id){
        industryService.deleteIndustry(id);
        return ResponseEntity.ok("Industry deleted!!");
    }
}
