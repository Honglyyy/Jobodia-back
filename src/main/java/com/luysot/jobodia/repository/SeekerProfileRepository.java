package com.luysot.jobodia.repository;

import com.luysot.jobodia.model.SeekerProfile;
import com.luysot.jobodia.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, Long> {
    Optional<SeekerProfile> findByUser(Users user);
}