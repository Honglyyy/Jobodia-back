package com.luysot.jobodia.service;

import com.luysot.jobodia.dto.UsersDTOs.RegisterRequestDto;
import com.luysot.jobodia.dto.UsersDTOs.UserResponseDto;
import com.luysot.jobodia.exception.DuplicateResourceException;
import com.luysot.jobodia.exception.InvalidRequestException;
import com.luysot.jobodia.exception.ResourceNotFoundException;
import com.luysot.jobodia.mapper.UserMapper;
import com.luysot.jobodia.model.Users;
import com.luysot.jobodia.repository.UserRepository;
import com.luysot.jobodia.util.UserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserUtil userUtil;
    private final EmailService emailService;

    public UserResponseDto register(RegisterRequestDto requestDto){
        Users deletedUser = userRepository.findByEmailAndIsDeletedTrue(requestDto.email()).orElse(null);
        Users activeUser = userRepository.findActiveByEmail(requestDto.email()).orElse(null);

        if(activeUser != null){
            throw new DuplicateResourceException("Email already exists");
        }

        if(userRepository.findActiveByUsername(requestDto.username()).isPresent()){
            throw new DuplicateResourceException("Username already exists");
        }

        if (deletedUser != null && !deletedUser.getRole().equals(requestDto.role())) {
            throw new InvalidRequestException("Role mismatch for restored account");
        }

        Users user = deletedUser != null ? deletedUser : new Users();
        user.setEmail(requestDto.email());
        user.setUsername(requestDto.username());
        user.setRole(deletedUser != null ? deletedUser.getRole() : requestDto.role());
        user.setPassword(passwordEncoder.encode(requestDto.password()));
        user.setUserId(user.getUserId() == null ? UUID.randomUUID().toString() : user.getUserId());
        user.setIsDeleted(false);
        user.setDeletedAt(null);
        user.setResetPasswordOtp(null);
        user.setResetPasswordOtpExpireAt(null);
        user.setVerifyOtp(null);
        user.setVerifyOtpExpireAt(null);

        userRepository.save(user);

        sendVerifyOtp(user.getEmail());

        return userMapper.toDto(user);
    }

    public void sendResetOtp(String email){
        Users user = userRepository.findActiveByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String otp = generateOtp();
        Long expireAt = System.currentTimeMillis() + 10 * 60 * 1000;

        user.setResetPasswordOtp(otp);
        user.setResetPasswordOtpExpireAt(expireAt);

        userRepository.save(user);

        try{
            emailService.sendResetOtp(user.getEmail(), otp);
        }

        catch (Exception e){
            e.printStackTrace();
        }
    }

    public UserResponseDto verifyOtp(String email,String otp){
        Users existingUser = userRepository.findActiveByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if(existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()){
            throw new InvalidRequestException("Otp expired");
        }

        if(!existingUser.getVerifyOtp().equals(otp)){
            throw new InvalidRequestException("Invalid OTP");
        }

        existingUser.setIsVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpExpireAt(0L);

        userRepository.save(existingUser);
        emailService.successOtp(existingUser.getEmail());
        return  userMapper.toDto(existingUser);
    }

    public void resetPassword(String otp, String email, String password){
        Users user =  userRepository.findActiveByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if(user.getResetPasswordOtpExpireAt() < System.currentTimeMillis()){
            throw new InvalidRequestException("Otp expired");
        }
        if(!user.getResetPasswordOtp().equals(otp)||user.getResetPasswordOtp() == null){
            throw new InvalidRequestException("Invalid OTP");
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setResetPasswordOtpExpireAt(0L);
        user.setResetPasswordOtp(null);

        userRepository.save(user);
    }

    public String generateOtp(){
        return String.valueOf(ThreadLocalRandom.current().nextInt(100000,1000000));
    }



    public void sendVerifyOtp(String email){
        Long verifyOtpExpiration = System.currentTimeMillis() + 10 * 60 * 1000;
        String verifyOtp = userUtil.generateOtp();
        Users existingUser = userRepository.findActiveByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("User not found"));

        if(existingUser.getIsVerified()){
            return ;
        }

        existingUser.setVerifyOtp(verifyOtp);
        existingUser.setVerifyOtpExpireAt(verifyOtpExpiration);

        userRepository.save(existingUser);

        try{
            emailService.sendOtp(existingUser.getEmail(),verifyOtp);
        }
        catch (Exception e){
            e.printStackTrace();
        }
    }

    public void softDeleteUser(String email){
        Users user = userRepository.findActiveByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            return;
        }

        user.setIsDeleted(true);
        user.setDeletedAt(new Timestamp(System.currentTimeMillis()));
        user.setVerifyOtp(null);
        user.setVerifyOtpExpireAt(null);
        user.setResetPasswordOtp(null);
        user.setResetPasswordOtpExpireAt(null);

        userRepository.save(user);
    }

}
