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
    public CommandLineRunner initData() {
        return args -> {

            // ─── Super Admin ─────────────────────────────────────────
            createIfNotExists("superadmin@gym.com", "admin123", Role.SUPER_ADMIN);

            // ─── Admins ──────────────────────────────────────────────
            createIfNotExists("admin1@gym.com", "admin123", Role.ADMIN);
            createIfNotExists("admin2@gym.com", "admin123", Role.ADMIN);

            // ─── Coaches ─────────────────────────────────────────────
            createIfNotExists("coach1@gym.com", "coach123", Role.COACH);
            createIfNotExists("coach2@gym.com", "coach123", Role.COACH);
            createIfNotExists("coach3@gym.com", "coach123", Role.COACH);

            // ─── Members ─────────────────────────────────────────────
            createIfNotExists("member1@gym.com", "member123", Role.MEMBRE);
            createIfNotExists("member2@gym.com", "member123", Role.MEMBRE);
            createIfNotExists("member3@gym.com", "member123", Role.MEMBRE);
            createIfNotExists("member4@gym.com", "member123", Role.MEMBRE);
            createIfNotExists("member5@gym.com", "member123", Role.MEMBRE);

            log.info("✅ All credentials initialized successfully");
        };
    }

    private void createIfNotExists(String email, String password, Role role) {
        if (!repository.existsByEmail(email)) {
            UserCredential user = UserCredential.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role(role)
                    .suspended(false)
                    .build();
            repository.save(user);
            log.info("✅ Created: {} / {}", email, password);
        }
    }
}