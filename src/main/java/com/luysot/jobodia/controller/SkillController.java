package com.luysot.jobodia.controller;


import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerSkillsRequestDto;
import com.luysot.jobodia.dto.SeekerProfileDTOs.SeekerSkillsResponseDto;
import com.luysot.jobodia.dto.SkillsDTOs.SkillRequestDto;
import com.luysot.jobodia.dto.SkillsDTOs.SkillResponseDto;
import com.luysot.jobodia.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/skills")
public class SkillController {

    private final SkillService skillService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<SkillResponseDto> addSkill(@Valid @RequestBody SkillRequestDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(skillService.addSkill(dto));
    }

    @GetMapping
    ResponseEntity<Page<SkillResponseDto>> findSkills(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable){
        return ResponseEntity.ok(skillService.findSkills(pageable));
    }

    @GetMapping("/{id}")
    ResponseEntity<SkillResponseDto> findSkill(@PathVariable Long id){
        return ResponseEntity.ok().body(skillService.findSkill(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<Void> deleteSkill(@PathVariable Long id){
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }


}
