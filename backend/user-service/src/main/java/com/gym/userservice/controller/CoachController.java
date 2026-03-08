package com.gym.userservice.controller;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Coach;
import com.gym.userservice.service.CoachService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/coaches")
@RequiredArgsConstructor
public class CoachController {

    private final CoachService coachService;

    // ─── Admin only ──────────────────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Coach> createCoach(
            @Valid @RequestBody CreateCoachRequest request) {
        return ResponseEntity.ok(coachService.createCoach(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Coach>> getAllCoaches() {
        return ResponseEntity.ok(coachService.getAllCoaches());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCoach(@PathVariable String id) {
        coachService.deleteCoach(id);
        return ResponseEntity.ok("Coach deleted successfully");
    }

    // ─── Admin or Coach ──────────────────────────────────────────────
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COACH')")
    public ResponseEntity<Coach> getCoachById(@PathVariable String id) {
        return ResponseEntity.ok(coachService.getCoachById(id));
    }

    @GetMapping("/auth/{authId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COACH')")
    public ResponseEntity<Coach> getCoachByAuthId(@PathVariable String authId) {
        return ResponseEntity.ok(coachService.getCoachByAuthId(authId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COACH')")
    public ResponseEntity<Coach> updateCoach(
            @PathVariable String id,
            @RequestBody UpdateCoachRequest request) {
        return ResponseEntity.ok(coachService.updateCoach(id, request));
    }
}
