package com.gym.userservice.controller;

import com.gym.userservice.dto.CreateFreeTrialRequest;
import com.gym.userservice.model.FreeTrial;
import com.gym.userservice.service.FreeTrialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users/trials")
@RequiredArgsConstructor
public class FreeTrialController {

    private final FreeTrialService freeTrialService;

    // ─── Public ──────────────────────────────────────────────────────

    // ─── Admin only ──────────────────────────────────────────────────
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FreeTrial>> getAllTrials() {
        return ResponseEntity.ok(freeTrialService.getAllTrials());
    }

    @PutMapping("/use/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FreeTrial> markAsUsed(@PathVariable String id) {
        return ResponseEntity.ok(freeTrialService.markAsUsed(id));
    }

    @PostMapping
    public ResponseEntity<?> createFreeTrial(
            @Valid @RequestBody CreateFreeTrialRequest request) {
        try {
            FreeTrial trial = freeTrialService.createFreeTrial(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Congratulations! Your free trial has been registered.",
                    "data", trial
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTrial(@PathVariable String id) {
        freeTrialService.deleteTrial(id);
        return ResponseEntity.ok("Trial deleted successfully");
    }
}