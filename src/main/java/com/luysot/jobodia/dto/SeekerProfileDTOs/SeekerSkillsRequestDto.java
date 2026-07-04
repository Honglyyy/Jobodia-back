package com.luysot.jobodia.dto.SeekerProfileDTOs;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.util.Set;

@Builder
public record SeekerSkillsRequestDto(
        @NotEmpty(message = "At least one skill ID is required")
        Set<@NotNull(message = "Skill id cannot be null") @Positive(message = "Skill id must be positive") Long> skillId
) {
}
