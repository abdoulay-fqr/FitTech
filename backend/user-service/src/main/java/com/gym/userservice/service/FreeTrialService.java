package com.gym.userservice.service;

import com.gym.userservice.dto.CreateFreeTrialRequest;
import com.gym.userservice.model.FreeTrial;
import com.gym.userservice.repository.FreeTrialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FreeTrialService {

    private final FreeTrialRepository repository;

    // ─── Create free trial ───────────────────────────────────────────
    public FreeTrial createFreeTrial(CreateFreeTrialRequest request) {
        FreeTrial trial = FreeTrial.builder()
                .fullName(request.getFullName())
                .address(request.getAddress())
                .createdAt(LocalDateTime.now())
                .used(false)
                .build();
        return repository.save(trial);
    }

    // ─── Get all trials ──────────────────────────────────────────────
    public List<FreeTrial> getAllTrials() {
        return repository.findAll();
    }

    // ─── Mark trial as used ──────────────────────────────────────────
    public FreeTrial markAsUsed(String id) {
        FreeTrial trial = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trial not found"));
        trial.setUsed(true);
        return repository.save(trial);
    }

    // ─── Delete trial ────────────────────────────────────────────────
    public void deleteTrial(String id) {
        repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trial not found"));
        repository.deleteById(id);
    }
}