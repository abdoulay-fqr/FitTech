package com.gym.userservice.config;

import com.gym.userservice.model.Admin;
import com.gym.userservice.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final AdminRepository adminRepository;

    @Bean
    public CommandLineRunner initAdmin() {
        return args -> {
            if (!adminRepository.existsByAuthId("SYSTEM")) {
                Admin admin = Admin.builder()
                        .authId("SYSTEM")
                        .fullName("System Admin")
                        .phone("")
                        .build();
                adminRepository.save(admin);
                log.info("✅ System admin profile created in user_db");
            } else {
                log.info("✅ System admin profile already exists");
            }
        };
    }
}