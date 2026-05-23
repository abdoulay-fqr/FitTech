package com.gym.userservice.config;

import com.gym.userservice.dto.ChangePasswordRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "auth-service", url = "http://localhost:8081")
public interface AuthServiceClient {

    // ── Check if email exists ──────────────────────────────────────
    @GetMapping("/auth/exists")
    boolean emailExists(@RequestParam("email") String email);

    // ── Create member credentials ──────────────────────────────────
    @PostMapping("/auth/internal/member")
    String createMemberCredentials(@RequestBody InternalAuthRequest request);

    // ── Create coach credentials ───────────────────────────────────
    @PostMapping("/auth/internal/coach")
    String createCoachCredentials(@RequestBody InternalAuthRequest request);

    // ── Create admin credentials ───────────────────────────────────
    @PostMapping("/auth/internal/admin")
    String createAdminCredentials(@RequestBody InternalAuthRequest request);

    // ── Delete user credentials ────────────────────────────────────
    @DeleteMapping("/auth/internal/users/{authId}")
    void deleteUserCredentials(@PathVariable("authId") String authId);

    // ── Reset another user's password ─────────────────────────────
    @PutMapping("/auth/internal/reset-password/{authId}")
    void resetUserPassword(
            @PathVariable("authId") String authId,
            @RequestBody ChangePasswordRequest request);

    // ── Change own password ────────────────────────────────────────
    @PutMapping("/auth/internal/change-password/{authId}")
    void changeOwnPassword(
            @PathVariable("authId") String authId,
            @RequestBody ChangePasswordRequest request);

    // ── Get user ID by email ───────────────────────────────────────
    @GetMapping("/auth/internal/id-by-email")
    String getIdByEmail(@RequestParam("email") String email);
}