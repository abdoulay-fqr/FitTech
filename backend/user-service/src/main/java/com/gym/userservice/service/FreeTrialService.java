package com.gym.userservice.service;

import com.gym.userservice.config.AuthServiceClient;
import com.gym.userservice.dto.CreateFreeTrialRequest;
import com.gym.userservice.model.FreeTrial;
import com.gym.userservice.repository.FreeTrialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FreeTrialService {

    private final FreeTrialRepository freeTrialRepository;
    private final AuthServiceClient authServiceClient;

    public FreeTrial createFreeTrial(CreateFreeTrialRequest request) {

        // ──► Check if email already has an account
        boolean exists = authServiceClient.emailExists(request.getEmail());
        if (exists) {
            throw new RuntimeException("You already have an account!");
        }

        // ──► Check if free trial already requested
        if (freeTrialRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("You already requested a free trial!");
        }

        FreeTrial trial = FreeTrial.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .createdAt(LocalDateTime.now())
                .used(false)
                .build();

        return freeTrialRepository.save(trial);
    }

    public List<FreeTrial> getAllTrials() {
        return freeTrialRepository.findAll();
    }

    public FreeTrial markAsUsed(String id) {
        FreeTrial trial = freeTrialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trial not found"));
        trial.setUsed(true);
        return freeTrialRepository.save(trial);
    }

    public void deleteTrial(String id) {
        freeTrialRepository.deleteById(id);
    }

    public Map<String, Object> checkFreeTrial(String email) {
        Optional<FreeTrial> trial = freeTrialRepository.findByEmail(email);

        if (trial.isEmpty()) {
            return Map.of("exists", false);
        }

        return Map.of(
                "exists", true,
                "used", trial.get().isUsed()
        );
    }
}