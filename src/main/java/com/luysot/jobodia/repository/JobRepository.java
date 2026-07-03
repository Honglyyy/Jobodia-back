package com.luysot.jobodia.repository;

import com.luysot.jobodia.model.Categories;
import com.luysot.jobodia.model.EmployerProfiles;
import com.luysot.jobodia.model.Jobs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.Set;

public interface JobRepository extends JpaRepository<Jobs, Long> , JpaSpecificationExecutor<Jobs> {
    Set<Jobs> findByEmployer(EmployerProfiles employerProfile);
    Optional<Jobs> findByIdAndEmployer(Long id,EmployerProfiles employerProfiles);
    Set<Jobs> findByCategoriesCategoryName(String categoryName);
    void deleteByIdAndEmployer(Long id,EmployerProfiles employerProfiles);
}