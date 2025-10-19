package com.ahsumon.SalaryManagementSystem.config;

import com.ahsumon.SalaryManagementSystem.entity.User;
import com.ahsumon.SalaryManagementSystem.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default users if no users exist
        if (userRepository.count() == 0) {
            // Create Admin user
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build(); // active defaults to true

            // Create HR user
            User hr = User.builder()
                    .username("hr")
                    .password(passwordEncoder.encode("hr123"))
                    .role(User.Role.HR)
                    .build();

            // Create regular user
            User user = User.builder()
                    .username("user")
                    .password(passwordEncoder.encode("user123"))
                    .role(User.Role.USER)
                    .build();

            userRepository.save(admin);
            userRepository.save(hr);
            userRepository.save(user);

            log.info("==============================================");
            log.info("Default users created successfully!");
            log.info("ADMIN - Username: admin | Password: admin123");
            log.info("HR    - Username: hr    | Password: hr123");
            log.info("USER  - Username: user  | Password: user123");
            log.info("==============================================");
        } else {
            log.info("Users already exist. Skipping default user creation.");
        }
    }
}
