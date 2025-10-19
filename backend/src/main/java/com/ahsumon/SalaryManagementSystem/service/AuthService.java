package com.ahsumon.SalaryManagementSystem.service;

import com.ahsumon.SalaryManagementSystem.dto.AuthRequest;
import com.ahsumon.SalaryManagementSystem.dto.AuthResponse;
import com.ahsumon.SalaryManagementSystem.entity.User;
import com.ahsumon.SalaryManagementSystem.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidInputException("Invalid credentials");
        }

        // Generate JWT or token (optional)
        String token = "dummy-token"; // Replace with real JWT generation

        return new AuthResponse(user.getUsername(), token);
    }

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new InvalidInputException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);
        return new AuthResponse(user.getUsername(), "dummy-token");
    }
}
