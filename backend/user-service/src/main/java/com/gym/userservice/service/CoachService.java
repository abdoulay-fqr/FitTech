package com.gym.userservice.service;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Coach;
import com.gym.userservice.repository.CoachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoachService {

    private final CoachRepository repository;

    // ─── Create coach ────────────────────────────────────────────────
    public Coach createCoach(CreateCoachRequest request) {
        if (repository.existsByAuthId(request.getAuthId())) {
            throw new RuntimeException("Coach already exists");
        }
        Coach coach = Coach.builder()
                .authId(request.getAuthId())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .specialties(request.getSpecialties())
                .biography(request.getBiography())
                .build();
        return repository.save(coach);
    }

    // ─── Get all coaches ─────────────────────────────────────────────
    public List<Coach> getAllCoaches() {
        return repository.findAll();
    }

    // ─── Get coach by id ─────────────────────────────────────────────
    public Coach getCoachById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found"));
    }

    // ─── Get coach by authId ─────────────────────────────────────────
    public Coach getCoachByAuthId(String authId) {
        return repository.findByAuthId(authId)
                .orElseThrow(() -> new RuntimeException("Coach not found"));
    }

    // ─── Update coach ────────────────────────────────────────────────
    public Coach updateCoach(String id, UpdateCoachRequest request) {
        Coach coach = getCoachById(id);
        if (request.getFullName() != null) coach.setFullName(request.getFullName());
        if (request.getPhone() != null) coach.setPhone(request.getPhone());
        if (request.getSpecialties() != null) coach.setSpecialties(request.getSpecialties());
        if (request.getBiography() != null) coach.setBiography(request.getBiography());
        return repository.save(coach);
    }

    // ─── Delete coach ────────────────────────────────────────────────
    public void deleteCoach(String id) {
        repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found"));
        repository.deleteById(id);
    }
}
