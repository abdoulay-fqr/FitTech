package com.gym.userservice.service;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.GymClass;
import com.gym.userservice.repository.GymClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GymClassService {

    private final GymClassRepository repository;

    // ─── Create class ────────────────────────────────────────────────
    public GymClass createClass(String coachId, CreateGymClassRequest request) {
        if (repository.existsByCoachIdAndDayOfWeekAndStartTime(
                coachId, request.getDayOfWeek(), request.getStartTime())) {
            throw new RuntimeException(
                    "This coach already has a class on " + request.getDayOfWeek() + " at " + request.getStartTime());
        }

        String name = request.getName();
        if (name == null || name.isEmpty()) {
            String shortId = java.util.UUID.randomUUID().toString().substring(0, 4);
            name = "CLASS-" + request.getDayOfWeek() + "-" + request.getStartTime() + "-" + shortId;
        }

        GymClass gymClass = GymClass.builder()
                .coachId(coachId)
                .name(name)
                .description(request.getDescription())
                .level(request.getLevel() != null ? request.getLevel() : "ALL LEVELS")
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .maxParticipants(request.getMaxParticipants() != null ? request.getMaxParticipants() : 0)
                .currentParticipants(0)
                .status("ACTIVE")
                .build();
        return repository.save(gymClass);
    }

    // ─── Get all classes (with search) ───────────────────────────────
    @Transactional(readOnly = true)
    public Page<GymClass> getAllClasses(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            return repository.searchClasses(search, pageable);
        }
        return repository.findAll(pageable);
    }

    // ─── Get classes by coach ────────────────────────────────────────
    @Transactional(readOnly = true)
    public Page<GymClass> getClassesByCoach(String coachId, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            return repository.searchClassesByCoach(coachId, search, pageable);
        }
        return repository.findByCoachId(coachId, pageable);
    }

    // ─── Get class by id ─────────────────────────────────────────────
    @Transactional(readOnly = true)
    public GymClass getClassById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
    }

    // ─── Update class ────────────────────────────────────────────────
    public GymClass updateClass(String id, UpdateGymClassRequest request) {
        GymClass gymClass = getClassById(id);
        if (request.getName() != null) gymClass.setName(request.getName());
        if (request.getDescription() != null) gymClass.setDescription(request.getDescription());
        if (request.getLevel() != null) gymClass.setLevel(request.getLevel());
        if (request.getDayOfWeek() != null) gymClass.setDayOfWeek(request.getDayOfWeek());
        if (request.getStartTime() != null) gymClass.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) gymClass.setEndTime(request.getEndTime());
        if (request.getMaxParticipants() != null) gymClass.setMaxParticipants(request.getMaxParticipants());
        if (request.getStatus() != null) gymClass.setStatus(request.getStatus());
        return repository.save(gymClass);
    }

    // ─── Delete class ────────────────────────────────────────────────
    public void deleteClass(String id) {
        repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        repository.deleteById(id);
    }

    // ─── Add participant ─────────────────────────────────────────────
    public GymClass addParticipant(String classId, String memberId) {
        GymClass gymClass = getClassById(classId);
        if (gymClass.getParticipantIds().contains(memberId)) {
            throw new RuntimeException("Member already in this class");
        }
        if (gymClass.getCurrentParticipants() >= gymClass.getMaxParticipants()) {
            throw new RuntimeException("Class is full");
        }
        gymClass.getParticipantIds().add(memberId);
        gymClass.setCurrentParticipants(gymClass.getCurrentParticipants() + 1);
        return repository.save(gymClass);
    }

    // ─── Remove participant ──────────────────────────────────────────
    public GymClass removeParticipant(String classId, String memberId) {
        GymClass gymClass = getClassById(classId);
        if (!gymClass.getParticipantIds().contains(memberId)) {
            throw new RuntimeException("Member not in this class");
        }
        gymClass.getParticipantIds().remove(memberId);
        gymClass.setCurrentParticipants(gymClass.getCurrentParticipants() - 1);
        return repository.save(gymClass);
    }

    // ─── Create class by admin (quick) ───────────────────────────────
    public GymClass createQuickClass(CreateQuickGymClassRequest request) {
        if (repository.existsByCoachIdAndDayOfWeekAndStartTime(
                request.getCoachId(), request.getDayOfWeek(), request.getStartTime())) {
            throw new RuntimeException(
                    "This coach already has a class on " + request.getDayOfWeek() + " at " + request.getStartTime());
        }

        String shortId = java.util.UUID.randomUUID().toString().substring(0, 4);
        String autoName = "CLASS-" + request.getDayOfWeek() + "-" + request.getStartTime() + "-" + shortId;

        GymClass gymClass = GymClass.builder()
                .coachId(request.getCoachId())
                .name(autoName)
                .description(null)
                .level(null)
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .maxParticipants(0)
                .currentParticipants(0)
                .status("ACTIVE")
                .build();
        return repository.save(gymClass);
    }
}