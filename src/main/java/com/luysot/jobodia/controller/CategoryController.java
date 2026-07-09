package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.CategoryDTOs.CategoryRequestDto;
import com.luysot.jobodia.dto.CategoryDTOs.CategoryResponseDto;
import com.luysot.jobodia.service.CategoryService;
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
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    ResponseEntity<Page<CategoryResponseDto>> findCategories(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable){
        return ResponseEntity.ok(categoryService.findCategories(pageable));
    }

    @GetMapping("/{id}")
    ResponseEntity<CategoryResponseDto> findCategory(@PathVariable Long id){
        return ResponseEntity.ok(categoryService.findCategory(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<CategoryResponseDto> addCategory(@Valid @RequestBody CategoryRequestDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.addCategory(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<CategoryResponseDto> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequestDto dto){
        return ResponseEntity.ok(categoryService.updateCategory(id,dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<?> deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
