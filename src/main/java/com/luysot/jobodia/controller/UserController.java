package com.luysot.jobodia.controller;

import com.luysot.jobodia.dto.RegisterRequestDto;
import com.luysot.jobodia.dto.UserResponseDto;
import com.luysot.jobodia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    ResponseEntity<UserResponseDto> register(@RequestBody RegisterRequestDto dto){
        return ResponseEntity.ok(userService.register(dto));
    }
}
