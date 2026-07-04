package com.luysot.jobodia.service;

import com.luysot.jobodia.dto.JobDTOs.JobRequestDto;
import com.luysot.jobodia.dto.JobDTOs.JobResponseDto;
import com.luysot.jobodia.mapper.JobMapper;
import com.luysot.jobodia.model.*;
import com.luysot.jobodia.model.enums.JobLevel;
import com.luysot.jobodia.model.enums.JobSite;
import com.luysot.jobodia.model.enums.JobTime;
import com.luysot.jobodia.repository.*;
import com.luysot.jobodia.service.specification.JobSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final CategoryRepository categoryRepository;
    private final SkillRepository skillRepository;
    private final IndustryRepository industryRepository;
    private final JobMapper jobMapper;
    private final JobSpecification jobSpecification;

    public JobResponseDto addJob(String email, JobRequestDto request){
        Users user = userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User not found!!"));
        EmployerProfiles employer = employerProfileRepository.findByUser(user).orElseThrow(()->new UsernameNotFoundException("User not found!!"));

        Set<Categories> categories = new HashSet<>(categoryRepository.findAllById(request.categoriesId()));
        Set<Skills> skills = new HashSet<>(skillRepository.findAllById(request.skillsId()));

        Industries industry = industryRepository.findById(request.industriesId())
                .orElseThrow(() -> new RuntimeException("Industry not found"));

        Jobs job = new Jobs();
        job.setTitle(request.title());
        job.setMinSalary(request.minSalary());
        job.setMaxSalary(request.maxSalary());
        job.setResponsibilities(request.responsibilities());
        job.setRequirements(request.requirements());
        job.setDescription(request.description());
        job.setSummary(request.summary());
        job.setBenefits(request.benefits());
        job.setJobType(request.jobType());
        job.setJobLevel(request.jobLevel());
        job.setJobGender(request.jobGender());
        job.setJobSite(request.jobSite());
        job.setYearsOfExperience(request.yearsOfExperience());
        job.setLanguage(request.languages());
        job.setQualification(request.qualifications());
        job.setAvailablePosition(request.availablePosition());
        job.setExpireAt(request.expiresAt());
        job.setCategories(categories);
        job.setSkills(skills);
        job.setIndustry(industry);
        job.setEmployer(employer);

        Jobs savedJob = jobRepository.save(job);
        return jobMapper.toDto(savedJob);
    }

    public JobResponseDto updateJob(Long id, JobRequestDto request, String email){
        Jobs existingJob = jobMapper.toEntity(findOwnEmployerJob(email,id));
        Set<Categories> categories = new HashSet<>(categoryRepository.findAllById(request.categoriesId()));
        Set<Skills> skills = new HashSet<>(skillRepository.findAllById(request.skillsId()));

        Industries industry = industryRepository.findById(request.industriesId())
                .orElseThrow(() -> new RuntimeException("Industry not found"));

        existingJob.setTitle(request.title());
        existingJob.setMinSalary(request.minSalary());
        existingJob.setMaxSalary(request.maxSalary());
        existingJob.setResponsibilities(request.responsibilities());
        existingJob.setRequirements(request.requirements());
        existingJob.setDescription(request.description());
        existingJob.setSummary(request.summary());
        existingJob.setBenefits(request.benefits());
        existingJob.setJobType(request.jobType());
        existingJob.setJobLevel(request.jobLevel());
        existingJob.setJobGender(request.jobGender());
        existingJob.setJobSite(request.jobSite());
        existingJob.setYearsOfExperience(request.yearsOfExperience());
        existingJob.setLanguage(request.languages());
        existingJob.setQualification(request.qualifications());
        existingJob.setAvailablePosition(request.availablePosition());
        existingJob.setExpireAt(request.expiresAt());
        existingJob.setCategories(categories);
        existingJob.setSkills(skills);
        existingJob.setIndustry(industry);

        Jobs savedJob = jobRepository.save(existingJob);
        return jobMapper.toDto(savedJob);
    }

    @Transactional
    public void deleteJob(Long id, String email){
        Users user = userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User not found!!"));
        EmployerProfiles employer = employerProfileRepository.findByUser(user).orElseThrow(()->new UsernameNotFoundException("User not found!!"));
        jobRepository.deleteByIdAndEmployer(id,employer);
    }

    public Page<JobResponseDto> findJobs(Pageable pageable){
        return jobRepository.findAll(pageable).map(jobMapper::toDto);
    }

    public Page<JobResponseDto> searchJob(
            String title,
            String industry,
            String company,
            String category,
            JobTime jobType,
            JobLevel jobLevel,
            JobSite jobSite,
            Pageable pageable
    ){
        Specification<Jobs> spec = (root, query, cb) -> cb.conjunction();
        if (title != null && !title.isBlank()) {
            spec = spec.and(JobSpecification.hasTitle(title));
        }

        if (industry != null && !industry.isBlank()) {
            spec = spec.and(JobSpecification.hasIndustry(industry));
        }

        if (company != null && !company.isBlank()) {
            spec = spec.and(JobSpecification.hasCompany(company));
        }

        if (category != null && !category.isBlank()) {
            spec = spec.and(JobSpecification.hasCategory(category));
        }

        if (jobType != null) {
            spec = spec.and(JobSpecification.hasJobType(jobType));
        }

        if (jobLevel != null) {
            spec = spec.and(JobSpecification.hasJobLevel(jobLevel));
        }

        if (jobSite != null) {
            spec = spec.and(JobSpecification.hasJobSite(jobSite));
        }


        return jobRepository.findAll(spec, pageable).map(jobMapper::toDto);
    }

    public Page<JobResponseDto> findNewlyAddedJob(Pageable pageable){
        return jobRepository.findAll(pageable).map(jobMapper::toDto);
    }

    public JobResponseDto findJob(Long id){
        Jobs job = jobRepository.findById(id).orElseThrow(()->new RuntimeException("Job not found"));
        return jobMapper.toDto(job);
    }


    public Page<JobResponseDto> findOwnEmployerJobs(String email, Pageable pageable){
        Users user = userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User not found!!"));
        EmployerProfiles employer = employerProfileRepository.findByUser(user).orElseThrow(()->new UsernameNotFoundException("User not found!!"));

        return jobRepository.findByEmployer(employer, pageable).map(jobMapper::toDto);
    }

    public JobResponseDto findOwnEmployerJob(String email, Long id){
        Users user = userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User not found!!"));
        EmployerProfiles employer = employerProfileRepository.findByUser(user).orElseThrow(()->new UsernameNotFoundException("User not found!!"));

        Jobs job = jobRepository.findByIdAndEmployer(id,employer).orElseThrow(()->new RuntimeException("Job not found"));
        return jobMapper.toDto(job);
    }
}
