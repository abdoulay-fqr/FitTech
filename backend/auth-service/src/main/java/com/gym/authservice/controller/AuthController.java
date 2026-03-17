package com.gym.authservice.controller;

import com.gym.authservice.dto.*;
import com.gym.authservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ─── Member self-register ────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // ─── Login for everyone ──────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ─── Admin creates coach ─────────────────────────────────────────
    @PostMapping("/coach")
    public ResponseEntity<AuthResponse> createCoach(
            @Valid @RequestBody CreateCoachRequest request) {
        return ResponseEntity.ok(authService.createCoach(request));
    }

    // ─── Validate token (called by API Gateway) ──────────────────────
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(
            @RequestParam String token) {
        return ResponseEntity.ok(authService.validateToken(token));
    }

    // ─── Suspend user ────────────────────────────────────────────────
    @PutMapping("/suspend/{userId}")
    public ResponseEntity<String> suspendUser(
            @PathVariable String userId) {
        authService.suspendUser(userId);
        return ResponseEntity.ok("User suspended successfully");
    }

    // ─── Unsuspend user ──────────────────────────────────────────────
    @PutMapping("/unsuspend/{userId}")
    public ResponseEntity<String> unsuspendUser(
            @PathVariable String userId) {
        authService.unsuspendUser(userId);
        return ResponseEntity.ok("User unsuspended successfully");
    }

    // ─── Forgot password ─────────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok("Reset email sent successfully");
    }
    // admiin
    @PostMapping("/admin")
    public ResponseEntity<AuthResponse> createAdmin(@RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(authService.createAdmin(request));
    }
    // email exixt dans auth db or no for freetrial
    @GetMapping("/exists")
    public ResponseEntity<Boolean> emailExists(@RequestParam String email) {
        return ResponseEntity.ok(authService.emailExists(email));
    }
    // ─── Reset password ──────────────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }

    // ─── Getting the user role ──────────────────────────────────────────────
    @GetMapping("/role")
    public ResponseEntity<String> getUserRole(@RequestParam String email) {
        return ResponseEntity.ok(authService.getUserRole(email));
    }
}