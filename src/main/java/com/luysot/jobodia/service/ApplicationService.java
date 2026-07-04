package com.luysot.jobodia.service;

import com.luysot.jobodia.dto.ApplicationDTOs.ApplicationRequestDto;
import com.luysot.jobodia.dto.ApplicationDTOs.ApplicationResponseDto;
import com.luysot.jobodia.dto.ApplicationDTOs.UpdateApplicationStatusRequestDto;
import com.luysot.jobodia.mapper.ApplicationMapper;
import com.luysot.jobodia.model.*;
import com.luysot.jobodia.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final JobRepository jobRepository;
    private final SeekerResumeRepository seekerResumeRepository;
    private final SeekerCoverLetterRepository seekerCoverLetterRepository;
    private final ApplicationMapper applicationMapper;
    private final EmployerProfileRepository employerProfileRepository;

    @Transactional
    public ApplicationResponseDto apply(String email, ApplicationRequestDto dto){
        SeekerProfiles seeker = getSeekerProfiles(email);
        SeekerResumes resume = seekerResumeRepository.findByIdAndSeeker(dto.resumeId(), seeker)
                .orElseThrow(()-> new RuntimeException("Resume not found"));
        SeekerCoverLetters coverLetter = seekerCoverLetterRepository.findByIdAndSeeker(dto.coverLetterId(),seeker)
                .orElseThrow(()-> new RuntimeException("Cover letter not found"));
        Jobs job = jobRepository.findById(dto.jobId())
                .orElseThrow(()-> new RuntimeException("Job not found"));

        Applications application = new Applications();
        application.setSeeker(seeker);
        application.setJob(job);
        application.setResume(resume);
        application.setCoverLetter(coverLetter);

        Applications savedApplication = applicationRepository.save(application);

        return applicationMapper.toDto(savedApplication);
    }

    public List<ApplicationResponseDto> findSeekerOwnApplications(String email){
        SeekerProfiles seeker = getSeekerProfiles(email);

        List<Applications> applications = applicationRepository.findBySeeker(seeker);

        return applications.stream()
                .map(applicationMapper::toDto)
                .toList();
    }

    public ApplicationResponseDto findSeekerOwnApplication(Long id, String email){
        SeekerProfiles seeker = getSeekerProfiles(email);

        Applications applications = applicationRepository.findByIdAndSeeker(id,seeker)
                .orElseThrow(()->new RuntimeException("Application not found"));

        return applicationMapper.toDto(applications);
    }

    @Transactional
    public void deleteSeekerOwnApplication(Long id, String email){
        SeekerProfiles seeker = getSeekerProfiles(email);

        applicationRepository.deleteByIdAndSeeker(id,seeker);
    }

    public List<ApplicationResponseDto> findApplicants(String email){
        EmployerProfiles employer = getEmployerProfiles(email);

        List<Applications> applications = applicationRepository.findByJobEmployerId(employer.getId());

        return applications.stream()
                .map(applicationMapper::toDto)
                .toList();
    }

    public ApplicationResponseDto findApplicant(Long applicationId,String email){
        EmployerProfiles employer = getEmployerProfiles(email);

        Applications application = applicationRepository.findByJobEmployerId_AndId(employer.getId(),applicationId)
                .orElseThrow(()->new RuntimeException("Applicant not found"));

        return applicationMapper.toDto(application);
    }


    public ApplicationResponseDto updateApplicationStatus( Long applicationId, UpdateApplicationStatusRequestDto reqStatus,String email){
        EmployerProfiles employer = getEmployerProfiles(email);

        Applications application = applicationRepository.findByJobEmployerId_AndId(employer.getId(),applicationId)
                .orElseThrow(()->new RuntimeException("Applicant not found"));

        application.setStatus(reqStatus.status());
        applicationRepository.save(application);

        return applicationMapper.toDto(application);
    }


    private @NonNull SeekerProfiles getSeekerProfiles(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found."));
        return seekerProfileRepository.findByUser(user)
                .orElseThrow(()-> new UsernameNotFoundException("Seeker with the following email is not found."));
    }

    private @NonNull EmployerProfiles getEmployerProfiles(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found."));
        return employerProfileRepository.findByUser(user)
                .orElseThrow(()-> new UsernameNotFoundException("Employer with the following email is not found."));
    }
}