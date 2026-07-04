package com.luysot.jobodia.dto.JobDTOs;

import com.luysot.jobodia.model.enums.JobGender;
import com.luysot.jobodia.model.enums.JobLevel;
import com.luysot.jobodia.model.enums.JobSite;
import com.luysot.jobodia.model.enums.JobTime;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Builder
public record JobRequestDto(
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title cannot exceed 255 characters")
        String title,

        @NotNull(message = "Minimum salary is required")
        @DecimalMin(value = "0.00", message = "Minimum salary must be greater than or equal to 0")
        @Digits(integer = 8, fraction = 2, message = "Invalid salary format")
        BigDecimal minSalary,

        @NotNull(message = "Maximum salary is required")
        @DecimalMin(value = "0.00", message = "Maximum salary must be greater than or equal to 0")
        @Digits(integer = 8, fraction = 2, message = "Invalid salary format")
        BigDecimal maxSalary,

        @NotEmpty(message = "At least one responsibility is required")
        List<@NotBlank(message = "Responsibility cannot be blank")
            String> responsibilities,

        @NotEmpty(message = "At least one requirement is required")
        List<@NotBlank(message = "Requirement cannot be blank")
                String> requirements,

        @NotBlank(message = "Description is required")
        String description,

        @Size(max = 1000, message = "Summary cannot exceed 1000 characters")
        String summary,

        @NotEmpty(message = "At least one benefit is required")
        List<@NotBlank(message = "Benifit cannot be blank")
                String> benefits,

        @NotNull(message = "Job type is required")
        JobTime jobType,

        @NotNull(message = "Job level is required")
        JobLevel jobLevel,

        @NotNull(message = "Job gender is required")
        JobGender jobGender,

        @NotNull(message = "Job site is required")
        JobSite jobSite,

        @Min(value = 0, message = "Years of experience cannot be negative")
        Long yearsOfExperience,

        List<String> languages,

        List<String> qualifications,

        @NotNull(message = "Available position is required")
        @Min(value = 1, message = "Available position must be at least 1")
        Integer availablePosition,

        @NotNull(message = "Expiration date is required")
        @Future(message = "Expiration date must be in the future")
        LocalDateTime expiresAt,

        @NotEmpty(message = "At least one category is required")
        Set<@NotNull(message = "Category id cannot be null") @Positive(message = "Category id must be positive") Long> categoriesId,

        @NotEmpty(message = "At least one skill is required")
        Set<@NotNull(message = "Skill id cannot be null") @Positive(message = "Skill id must be positive") Long> skillsId,

        @NotNull(message = "Industry id is required")
        @Positive(message = "Industry id must be positive")
        Long industriesId
) {
    @AssertTrue(message = "Minimum salary must be less than or equal to maximum salary")
    public boolean isSalaryRangeValid() {
        return minSalary == null || maxSalary == null || minSalary.compareTo(maxSalary) <= 0;
    }
}
