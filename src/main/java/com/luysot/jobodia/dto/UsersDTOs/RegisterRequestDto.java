package com.luysot.jobodia.dto.UsersDTOs;

import com.luysot.jobodia.model.enums.Roles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(
        @Size(min = 3, max = 500)
        String username,
        @Email
        String email,
        @Size(min = 8)
        String password,
        Roles role
) {
}
