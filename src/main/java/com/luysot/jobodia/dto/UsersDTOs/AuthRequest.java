package com.luysot.jobodia.dto.UsersDTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record AuthRequest(
        @Email
        String email,
        @Size(min = 8)
        String password
) {
}
