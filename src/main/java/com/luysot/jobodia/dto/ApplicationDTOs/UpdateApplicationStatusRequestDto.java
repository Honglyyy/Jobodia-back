package com.luysot.jobodia.dto.ApplicationDTOs;

import com.luysot.jobodia.model.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateApplicationStatusRequestDto(

        @NotNull(message = "Application status is required")
        ApplicationStatus status
) {
}
