package com.luysot.jobodia.service;

import com.luysot.jobodia.model.Users;
import com.luysot.jobodia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findActiveByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Email is not found"));
        return User
                .withUsername(user.getEmail()).
                password(user.getPassword())
                .authorities(user.getAuthorities())
                .build();
    }
}
