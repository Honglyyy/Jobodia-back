package com.luysot.jobodia.mapper;

import com.luysot.jobodia.dto.UsersDTOs.UserResponseDto;
import com.luysot.jobodia.model.Users;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponseDto toDto(Users user){
        return UserResponseDto.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .userId(user.getUserId())
                .isVerified(user.getIsVerified())
                .build();
    }

}
