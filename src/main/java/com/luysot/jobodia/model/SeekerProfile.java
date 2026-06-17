package com.luysot.jobodia.model;

import com.luysot.jobodia.model.enums.UserGender;
import jakarta.persistence.*;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class SeekerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "profile_picture")
    private String profilePictureUrl;
    @Column(name = "profile_picture_stored_name")
    private String profilePictureStoredName;
    @Column(name = "profile_picture_orignal_name")
    private String profilePictureOriginalName;
    @Column(name = "profile_picture_content_type")
    private String profilePictureContentType;

    @Column(name = "gender")
    @Enumerated(value = EnumType.STRING)
    private UserGender gender;

    @Column(name = "address")
    private String address;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;
}
