package com.ahsumon.SalaryManagementSystem.controller;



import com.ahsumon.SalaryManagementSystem.config.JwtTokenProvider;
import com.ahsumon.SalaryManagementSystem.dto.AuthRequest;
import com.ahsumon.SalaryManagementSystem.dto.AuthResponse;
import com.ahsumon.SalaryManagementSystem.dto.ApiResponse;
import com.ahsumon.SalaryManagementSystem.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Requirement 9: Login with JWT token generation
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody AuthRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(authentication);

            Map<String, Object> response = new HashMap<>();
            response.put("username", request.getUsername());
            response.put("token", token);
            response.put("type", "Bearer");

            log.info("User {} logged in successfully", request.getUsername());
            return ResponseEntity.ok(new ApiResponse<>("Login successful", response, true));
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Invalid username or password", null, false));
        }
    }

    /**
     * Requirement 9: Register new user
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody AuthRequest request) {
        log.info("Registration attempt for user: {}", request.getUsername());
        try {
            AuthResponse authResponse = authService.register(request);

            Map<String, Object> response = new HashMap<>();
            response.put("username", authResponse.getUsername());
            response.put("message", "User registered successfully");

            log.info("User {} registered successfully", request.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Registration successful", response, true));
        } catch (Exception e) {
            log.error("Registration failed for user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null, false));
        }
    }

    /**
     * Requirement 9: Logout endpoint
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout() {
        log.info("User logout");
        return ResponseEntity.ok(new ApiResponse<>("Logged out successfully", null, true));
    }

    /**
     * Refresh JWT token
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refreshToken(
            @RequestHeader("Authorization") String bearerToken) {
        log.info("Token refresh request");
        try {
            // Extract token without "Bearer " prefix
            String token = bearerToken.substring(7);

            if (jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                String newToken = jwtTokenProvider.generateTokenFromUsername(username);

                Map<String, Object> response = new HashMap<>();
                response.put("token", newToken);
                response.put("type", "Bearer");

                return ResponseEntity.ok(new ApiResponse<>("Token refreshed successfully", response, true));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>("Invalid or expired token", null, false));
            }
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Token refresh failed", null, false));
        }
    }

    /**
     * Validate JWT token
     */
    @GetMapping("/validate-token")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateToken(
            @RequestHeader("Authorization") String bearerToken) {
        log.info("Token validation request");
        try {
            String token = bearerToken.substring(7);
            boolean isValid = jwtTokenProvider.validateToken(token);

            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);
            response.put("username", isValid ? jwtTokenProvider.getUsernameFromToken(token) : null);

            return ResponseEntity.ok(new ApiResponse<>("Token validation result", response, isValid));
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Invalid token", null, false));
        }
    }
}
