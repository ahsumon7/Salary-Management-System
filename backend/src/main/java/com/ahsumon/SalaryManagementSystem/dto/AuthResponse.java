package com.ahsumon.SalaryManagementSystem.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    @JsonProperty("username")
    private String username;

    @JsonProperty("token")
    private String token;

    @JsonProperty("type")
    @Builder.Default
    private String type = "Bearer";

    @JsonProperty("expiresIn")
    @Builder.Default
    private Long expiresIn = 86400000L; // 24 hours in milliseconds

    @JsonProperty("message")
    private String message;

    // Constructor for backward compatibility
    public AuthResponse(String username, String token) {
        this.username = username;
        this.token = token;
        this.type = "Bearer";
        this.expiresIn = 86400000L;
        this.message = "Authentication successful";
    }
}
