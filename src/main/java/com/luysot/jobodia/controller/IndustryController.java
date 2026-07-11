package com.luysot.jobodia.controller;


import com.luysot.jobodia.dto.IndustryDTOs.IndustryRequestDto;
import com.luysot.jobodia.dto.IndustryDTOs.IndustryResponseDto;
import com.luysot.jobodia.service.IndustryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v1/industries")
public class IndustryController {
    private final IndustryService industryService;

    @GetMapping
    ResponseEntity<Page<IndustryResponseDto>> findIndustries(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable){
        return ResponseEntity.ok(industryService.findIndustries(pageable));
    }

    @GetMapping("/{id}")
    ResponseEntity<IndustryResponseDto> findIndustry(@PathVariable @Positive(message = "Industry id must be positive") Long id){
        return ResponseEntity.ok(industryService.findIndustry(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<IndustryResponseDto> addIndustry(@Valid @RequestBody IndustryRequestDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(industryService.addIndustry(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<IndustryResponseDto> updateIndustry(@PathVariable @Positive(message = "Industry id must be positive") Long id, @Valid @RequestBody IndustryRequestDto dto){
        return ResponseEntity.ok(industryService.updateIndustry(id,dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<?> deleteIndustry(@PathVariable @Positive(message = "Industry id must be positive") Long id){
        industryService.deleteIndustry(id);
        return ResponseEntity.noContent().build();
    }
}
