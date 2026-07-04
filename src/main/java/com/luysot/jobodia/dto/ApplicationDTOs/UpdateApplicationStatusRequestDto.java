package com.luysot.jobodia.dto.ApplicationDTOs;

import com.luysot.jobodia.model.enums.ApplicationStatus;

public record UpdateApplicationStatusRequestDto(

        ApplicationStatus status
) {
}
