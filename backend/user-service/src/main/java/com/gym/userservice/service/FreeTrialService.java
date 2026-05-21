package com.gym.userservice.service;

import com.gym.userservice.config.AuthServiceClient;
import com.gym.userservice.dto.CreateFreeTrialRequest;
import com.gym.userservice.model.FreeTrial;
import com.gym.userservice.repository.FreeTrialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FreeTrialService {

    private final FreeTrialRepository freeTrialRepository;
    private final AuthServiceClient authServiceClient;

    // ─── Create free trial ───────────────────────────────────────────
    public FreeTrial createFreeTrial(CreateFreeTrialRequest request) {
        boolean exists = authServiceClient.emailExists(request.getEmail());
        if (exists) {
            throw new RuntimeException("You already have an account!");
        }
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

    // ─── Get all trials (with search, filter, pagination) ────────────
    @Transactional(readOnly = true)
    public Page<FreeTrial> getAllTrials(String search, Boolean used, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (search != null && !search.isEmpty() && used != null) {
            return freeTrialRepository.searchTrialsByUsed(search, used, pageable);
        }
        if (search != null && !search.isEmpty()) {
            return freeTrialRepository.searchTrials(search, pageable);
        }
        if (used != null) {
            return freeTrialRepository.findByUsed(used, pageable);
        }
        return freeTrialRepository.findAllOrderByUsedAsc(pageable);
    }

    // ─── Mark as used ────────────────────────────────────────────────
    public FreeTrial markAsUsed(String id) {
        FreeTrial trial = freeTrialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trial not found"));
        trial.setUsed(true);
        return freeTrialRepository.save(trial);
    }

    // ─── Delete trial ────────────────────────────────────────────────
    public void deleteTrial(String id) {
        freeTrialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trial not found"));
        freeTrialRepository.deleteById(id);
    }

    // ─── Check free trial by email ───────────────────────────────────
    @Transactional(readOnly = true)
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