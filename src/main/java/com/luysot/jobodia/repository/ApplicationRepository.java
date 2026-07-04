package com.luysot.jobodia.repository;

import com.luysot.jobodia.model.Applications;
import com.luysot.jobodia.model.EmployerProfiles;
import com.luysot.jobodia.model.SeekerProfiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Applications, Long> {
    List<Applications> findBySeeker(SeekerProfiles seeker);
    Optional<Applications> findByIdAndSeeker(Long id, SeekerProfiles seeker);
    void deleteByIdAndSeeker(Long id, SeekerProfiles seeker);
    List<Applications> findByJobEmployerId(Long employerId);

    Optional<Applications> findByJobEmployerId_AndId(Long jobEmployerId, Long id);
}