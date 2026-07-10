package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.UsersDTOs.RegisterRequestDto;
import com.luysot.jobodia.dto.UsersDTOs.ResetPasswordRequest;
import com.luysot.jobodia.dto.UsersDTOs.UserResponseDto;
import com.luysot.jobodia.dto.UsersDTOs.VerifyUserDto;
import com.luysot.jobodia.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v1/auth")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    ResponseEntity<UserResponseDto> register(@Valid @RequestBody RegisterRequestDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(dto));
    }

    @PostMapping("/verify-otp")
    ResponseEntity<Void> sendVerifyOtp(@Valid @RequestBody VerifyUserDto verifyUserDto){
        userService.verifyOtp(verifyUserDto.email(),verifyUserDto.otp());
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/send-reset-otp")
    public ResponseEntity<Void> sendResetOtp(
            @RequestParam
            @NotBlank(message = "Email is required")
            @Email(message = "Invalid email format")
            String email
    ) {
        userService.sendResetOtp(email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(
                request.otp(),
                request.email(),
                request.password()
        );
        return ResponseEntity.noContent().build();
    }
}
