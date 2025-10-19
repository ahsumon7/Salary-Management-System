package com.ahsumon.SalaryManagementSystem.service;

import com.ahsumon.SalaryManagementSystem.dto.AuthRequest;
import com.ahsumon.SalaryManagementSystem.dto.AuthResponse;
import com.ahsumon.SalaryManagementSystem.entity.User;
import com.ahsumon.SalaryManagementSystem.exception.InvalidInputException;
import com.ahsumon.SalaryManagementSystem.exception.ResourceNotFoundException;
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

    /**
     * Register new user with validation
     * @param request AuthRequest containing username and password
     * @return AuthResponse with user details
     */
    public AuthResponse register(AuthRequest request) {
        // Validate username
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new InvalidInputException("Username cannot be empty");
        }

        if (request.getUsername().length() < 3) {
            throw new InvalidInputException("Username must be at least 3 characters long");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new InvalidInputException("Username already exists");
        }

        // Validate password
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new InvalidInputException("Password must be at least 6 characters long");
        }

        // Determine role (you can add logic here to assign ADMIN role conditionally)
        // For now, all new users are regular users
        User.Role userRole = User.Role.USER;

        // If this is the first user, make them ADMIN
        long userCount = userRepository.count();
        if (userCount == 0) {
            userRole = User.Role.ADMIN;
            log.info("First user registered, assigning ADMIN role");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .active(true)
                .build();

        userRepository.save(user);
        log.info("User {} registered successfully with role {}", user.getUsername(), userRole);

        return new AuthResponse(user.getUsername(), null); // Token generated in controller
    }

    /**
     * Verify user credentials (used if needed)
     * @param username Username
     * @param password Plain password
     * @return true if credentials are valid
     */
    public boolean verifyCredentials(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return passwordEncoder.matches(password, user.getPassword());
    }

    /**
     * Get user by username
     * @param username Username
     * @return User entity
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}
