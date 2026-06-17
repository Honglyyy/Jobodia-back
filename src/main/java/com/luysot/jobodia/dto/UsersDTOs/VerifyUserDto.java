package com.luysot.jobodia.dto.UsersDTOs;

import jakarta.validation.constraints.Email;

public record VerifyUserDto(
        @Email
        String email,
        String otp
) {
}
