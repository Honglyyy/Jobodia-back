package com.luysot.jobodia.service;

import com.luysot.jobodia.config.SecurityConfig;
import com.luysot.jobodia.dto.RegisterRequestDto;
import com.luysot.jobodia.dto.UserResponseDto;
import com.luysot.jobodia.mapper.UserMapper;
import com.luysot.jobodia.model.Users;
import com.luysot.jobodia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserResponseDto register(RegisterRequestDto requestDto){

        if(userRepository.findByEmail(requestDto.email()).isPresent()){
            throw new RuntimeException("Email already exist.");
        }

        if(userRepository.findByUsername(requestDto.username()).isPresent()){
            throw new RuntimeException("User already exist.");
        }

        Users user = new Users();
        user.setEmail(requestDto.email());
        user.setUsername(requestDto.username());
        user.setRole(requestDto.role());
        user.setPassword(passwordEncoder.encode(requestDto.password()));
        user.setUserId(UUID.randomUUID().toString());

        userRepository.save(user);

        return userMapper.toDto(user);
    }
}

