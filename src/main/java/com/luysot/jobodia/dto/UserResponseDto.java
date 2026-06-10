package com.luysot.jobodia.dto;

import com.luysot.jobodia.model.enums.Roles;
import lombok.Builder;

@Builder
public record UserResponseDto(
        String username,
        String email,
        String userId,
        Boolean isVerified,
        Roles role
) {
}
