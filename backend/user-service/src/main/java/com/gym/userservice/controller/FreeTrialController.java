package com.gym.userservice.controller;

import com.gym.userservice.dto.CreateFreeTrialRequest;
import com.gym.userservice.dto.PagedResponse;
import com.gym.userservice.dto.PagedResponseUtil;
import com.gym.userservice.model.FreeTrial;
import com.gym.userservice.service.FreeTrialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users/trials")
@RequiredArgsConstructor
public class FreeTrialController {

    private final FreeTrialService freeTrialService;

    // ─── Public ──────────────────────────────────────────────────────
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkFreeTrial(@RequestParam String email) {
        return ResponseEntity.ok(freeTrialService.checkFreeTrial(email));
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

    // ─── Admin only ──────────────────────────────────────────────────
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<PagedResponse<FreeTrial>> getAllTrials(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean used,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(PagedResponseUtil.of(freeTrialService.getAllTrials(search, used, page, size)));
    }

    @PutMapping("/use/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<FreeTrial> markAsUsed(@PathVariable String id) {
        return ResponseEntity.ok(freeTrialService.markAsUsed(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> deleteTrial(@PathVariable String id) {
        freeTrialService.deleteTrial(id);
        return ResponseEntity.ok("Trial deleted successfully");
    }
}