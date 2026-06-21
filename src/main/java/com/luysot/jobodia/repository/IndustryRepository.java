package com.luysot.jobodia.repository;

import com.luysot.jobodia.model.Industries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IndustryRepository extends JpaRepository<Industries, Long> {
}