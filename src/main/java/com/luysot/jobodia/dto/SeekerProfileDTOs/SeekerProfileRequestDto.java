package com.luysot.jobodia.dto.SeekerProfileDTOs;

import com.luysot.jobodia.model.enums.UserGender;
import lombok.Builder;

@Builder
public record SeekerProfileRequestDto(
        String phoneNumber,
        UserGender gender,
        String address
) {
}
