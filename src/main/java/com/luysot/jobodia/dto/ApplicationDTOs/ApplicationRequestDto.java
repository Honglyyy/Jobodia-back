package com.luysot.jobodia.dto.ApplicationDTOs;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ApplicationRequestDto(
        @NotNull(message = "Job id can't be null.")
        @Positive(message = "Job id must be positive.")
        Long jobId,

        @NotNull(message = "Resume id can't be null.")
        @Positive(message = "Resume id must be positive.")
        Long resumeId,

        @NotNull(message = "Cover letter id can't be null.")
        @Positive(message = "Cover letter id must be positive.")
        Long coverLetterId
) {
}
