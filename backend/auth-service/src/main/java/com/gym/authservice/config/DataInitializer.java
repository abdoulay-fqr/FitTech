package com.gym.authservice.config;


import com.gym.authservice.model.Role;
import com.gym.authservice.model.UserCredential;
import com.gym.authservice.repository.UserCredentialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserCredentialRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initAdmin() {
        return args -> {
            if (!repository.existsByEmail("admin@gym.com")) {
                UserCredential admin = UserCredential.builder()
                        .email("admin@gym.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .suspended(false)
                        .build();
                repository.save(admin);
                log.info("✅ Admin account created: admin@gym.com / admin123");
            } else {
                log.info("✅ Admin account already exists");
            }
        };
    }
}