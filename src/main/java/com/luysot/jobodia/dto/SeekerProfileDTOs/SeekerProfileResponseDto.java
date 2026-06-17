package com.luysot.jobodia.dto.SeekerProfileDTOs;

import com.luysot.jobodia.model.enums.UserGender;
import lombok.Builder;

@Builder
public record SeekerProfileResponseDto(
        Long id,
        String username,
        String email,
        String phoneNumber,
        String profilePictureUrl,
        UserGender gender,
        String address,
        String userId
) {
}
