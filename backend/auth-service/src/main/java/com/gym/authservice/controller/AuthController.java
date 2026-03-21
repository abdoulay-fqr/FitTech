package com.gym.authservice.controller;

import com.gym.authservice.dto.*;
import com.gym.authservice.model.Role;
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

    // ─── Create admin ────────────────────────────────────────────────
    @PostMapping("/admin")
    public ResponseEntity<AuthResponse> createAdmin(
            @RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(authService.createAdmin(request));
    }

    // ─── Reset password ──────────────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }

    // ─── Internal endpoints (called by user-service only) ────────────

    @PostMapping("/internal/member")
    public ResponseEntity<String> internalCreateMember(
            @RequestBody InternalAuthRegisterRequest request) {
        String authId = authService.createCredentials(
                request.getEmail(), request.getPassword(), Role.MEMBRE);
        return ResponseEntity.ok(authId);
    }

    @PostMapping("/internal/coach")
    public ResponseEntity<String> internalCreateCoach(
            @RequestBody InternalAuthRegisterRequest request) {
        String authId = authService.createCredentials(
                request.getEmail(), request.getPassword(), Role.COACH);
        return ResponseEntity.ok(authId);
    }

    @PostMapping("/internal/admin")
    public ResponseEntity<String> internalCreateAdmin(
            @RequestBody InternalAuthRegisterRequest request) {
        String authId = authService.createCredentials(
                request.getEmail(), request.getPassword(), Role.ADMIN);
        return ResponseEntity.ok(authId);
    }

    @DeleteMapping("/internal/users/{authId}")
    public ResponseEntity<String> internalDeleteUser(
            @PathVariable String authId) {
        authService.deleteUser(authId);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/internal/reset-password/{authId}")
    public ResponseEntity<String> internalResetPassword(
            @PathVariable String authId,
            @RequestBody ChangePasswordRequest request) {
        authService.resetUserPassword(authId, request.getNewPassword());
        return ResponseEntity.ok("Password reset successfully");
    }

    @PutMapping("/internal/change-password/{authId}")
    public ResponseEntity<String> internalChangePassword(
            @PathVariable String authId,
            @RequestBody ChangePasswordRequest request) {
        authService.changeOwnPassword(
                authId, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/internal/id-by-email")
    public ResponseEntity<String> getIdByEmail(@RequestParam String email) {
        return ResponseEntity.ok(authService.getIdByEmail(email));
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> emailExists(@RequestParam String email) {
        return ResponseEntity.ok(authService.emailExists(email));
    }

    // ─── Change own password ─────────────────────────────────────────
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestHeader("X-User-Id") String authId,
            @RequestBody ChangePasswordRequest request) {
        authService.changeOwnPassword(authId, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    // ─── Admin resets another user's password ────────────────────────
    @PutMapping("/admin/reset-password/{authId}")
    public ResponseEntity<String> adminResetPassword(
            @PathVariable String authId,
            @RequestBody ChangePasswordRequest request) {
        authService.resetUserPassword(authId, request.getNewPassword());
        return ResponseEntity.ok("Password reset successfully");
    }

    // ─── Admin creates member ─────────────────────────────────────────
    @PostMapping("/member")
    public ResponseEntity<AuthResponse> createMember(
            @Valid @RequestBody CreateMemberRequest request) {
        return ResponseEntity.ok(authService.createMember(request));
    }
}