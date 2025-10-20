package com.ahsumon.SalaryManagementSystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    private static final String[] SWAGGER_WHITELIST = {
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/swagger-resources/**",
            "/webjars/**",
            "/swagger-ui/index.html"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ✅ Allow Swagger & OPTIONS Preflight
                        .requestMatchers(SWAGGER_WHITELIST).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public endpoints
                        .requestMatchers("/api/auth/**", "/api/public/**").permitAll()

                        // Your secured endpoints...
                        .requestMatchers(HttpMethod.GET, "/api/v1/employees/**").hasAnyRole("ADMIN", "HR", "USER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/employees/**").hasAnyRole("ADMIN", "HR")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/employees/**").hasAnyRole("ADMIN", "HR")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/employees/**").hasRole("ADMIN")

                        .requestMatchers("/api/v1/grades/**").hasAnyRole("ADMIN", "HR")

                        .requestMatchers(HttpMethod.GET, "/api/v1/bank-accounts/**").hasAnyRole("ADMIN", "HR", "USER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/bank-accounts/**").hasAnyRole("ADMIN", "HR")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/bank-accounts/**").hasAnyRole("ADMIN", "HR")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/bank-accounts/**").hasRole("ADMIN")

                        .requestMatchers("/api/v1/company-bank/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/salary/**").hasAnyRole("ADMIN", "HR")
                        .requestMatchers(HttpMethod.POST, "/api/salary/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/salary/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/transactions/**").hasAnyRole("ADMIN", "HR", "USER")

                        .requestMatchers("/api/reports/**").hasAnyRole("ADMIN", "HR")

                        .anyRequest().authenticated()
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setStatus(401);
                            response.getWriter().write("{\"error\": \"Unauthorized: " + authException.getMessage() + "\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json");
                            response.setStatus(403);
                            response.getWriter().write("{\"error\": \"Access Denied: " + accessDeniedException.getMessage() + "\"}");
                        })
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
