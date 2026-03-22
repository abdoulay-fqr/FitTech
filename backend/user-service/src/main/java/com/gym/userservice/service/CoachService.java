package com.gym.userservice.service;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Coach;
import com.gym.userservice.repository.CoachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoachService {

    private final CoachRepository repository;

    // ─── Create coach ────────────────────────────────────────────────
    public Coach createCoach(CreateCoachRequest request) {
        Coach coach = Coach.builder()
                .firstName(request.getFirstName())
                .secondName(request.getSecondName())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .specialties(request.getSpecialties())
                .biography(request.getBiography())
                .build();
        return repository.save(coach);
    }

    // ─── Get all coaches ─────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Page<Coach> getAllCoaches(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            return repository.searchCoaches(search, pageable);
        }
        return repository.findAll(pageable);
    }

    // ─── Get coach by id ─────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Coach getCoachById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found"));
    }

    // ─── Get coach by authId ─────────────────────────────────────────
    @Transactional(readOnly = true)
    public Coach getCoachByAuthId(String authId) {
        return repository.findByAuthId(authId)
                .orElseThrow(() -> new RuntimeException("Coach not found"));
    }

    // ─── Update coach ────────────────────────────────────────────────
    public Coach updateCoach(String id, UpdateCoachRequest request) {
        Coach coach = getCoachById(id);
        if (request.getFirstName() != null) coach.setFirstName(request.getFirstName());
        if (request.getSecondName() != null) coach.setSecondName(request.getSecondName());
        if (request.getPhone() != null) coach.setPhone(request.getPhone());
        if (request.getBirthDate() != null) coach.setBirthDate(request.getBirthDate());
        if (request.getGender() != null) coach.setGender(request.getGender());
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

    // ─── Update profile picture ──────────────────────────────────────
    public Coach updateProfilePic(String id, String path) {
        Coach coach = getCoachById(id);
        coach.setProfilePic(path);
        return repository.save(coach);
    }
}