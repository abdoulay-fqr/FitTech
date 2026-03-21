package com.gym.authservice.service;

import com.gym.authservice.config.InternalAdminRequest;
import com.gym.authservice.config.InternalCoachRequest;
import com.gym.authservice.config.InternalMemberRequest;
import com.gym.authservice.config.UserServiceClient;
import com.gym.authservice.dto.*;
import com.gym.authservice.model.Role;
import com.gym.authservice.model.UserCredential;
import com.gym.authservice.repository.UserCredentialRepository;
import com.gym.authservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserServiceClient userServiceClient;
    private final UserCredentialRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // ─── Member self-register ───────────────────────────────────────
    public AuthResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        UserCredential user = UserCredential.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.MEMBRE)
                .suspended(false)
                .build();
        repository.save(user);

        // ──► Auto create profile in user-service
        try {
            userServiceClient.createMemberProfile(
                    new InternalMemberRequest(
                            user.getId(),
                            request.getFirstName(),
                            request.getSecondName(),
                            request.getGender()
                    )
            );
        } catch (Exception e) {
            log.warn("Could not create member profile: {}", e.getMessage());
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    // ─── Login for everyone ─────────────────────────────────────────
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserCredential user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isSuspended()) {
            throw new RuntimeException("Account is suspended");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    // ─── Admin creates coach ─────────────────────────────────────────
    public AuthResponse createCoach(CreateCoachRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        UserCredential user = UserCredential.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.COACH)
                .suspended(false)
                .build();
        repository.save(user);

        // ──► Auto create profile in user-service
        try {
            userServiceClient.createCoachProfile(
                    new InternalCoachRequest(
                            user.getId(),
                            request.getFirstName(),
                            request.getSecondName(),
                            request.getPhone(),
                            request.getBirthDate(),
                            request.getGender(),
                            request.getSpecialties(),
                            request.getBiography()
                    )
            );
        } catch (Exception e) {
            log.warn("Could not create coach profile: {}", e.getMessage());
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    // ─── Validate token (called by API Gateway) ──────────────────────
    public boolean validateToken(String token) {
        return jwtUtil.isTokenValid(token);
    }

    // ─── Suspend user ────────────────────────────────────────────────
    public void suspendUser(String userId) {
        UserCredential user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setSuspended(true);
        repository.save(user);
    }

    // ─── Unsuspend user ──────────────────────────────────────────────
    public void unsuspendUser(String userId) {
        UserCredential user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setSuspended(false);
        repository.save(user);
    }

    // ─── Forgot password ─────────────────────────────────────────────
    public void forgotPassword(ForgotPasswordRequest request) {
        UserCredential user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String token = java.util.UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        repository.save(user);

        emailService.sendResetPasswordEmail(user.getEmail(), token, request.getPlatform());
    }

    // ─── Reset password ──────────────────────────────────────────────
    public void resetPassword(ResetPasswordRequest request) {
        UserCredential user = repository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        repository.save(user);
    }

    // ─── Create admin ────────────────────────────────────────────────
    public AuthResponse createAdmin(CreateAdminRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        UserCredential user = UserCredential.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .suspended(false)
                .build();
        repository.save(user);

        try {
            userServiceClient.createAdminProfile(
                    new InternalAdminRequest(
                            user.getId(),
                            request.getFirstName(),
                            request.getSecondName(),
                            request.getPhone(),
                            request.getBirthDate(),
                            request.getGender()
                    )
            );
        } catch (Exception e) {
            log.warn("Could not create admin profile: {}", e.getMessage());
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    // ─── Create credentials (internal) ───────────────────────────────
    public String createCredentials(String email, String password, Role role) {
        if (repository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        UserCredential user = UserCredential.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .suspended(false)
                .build();

        repository.save(user);
        return user.getId();
    }

    // ─── Delete user (internal) ───────────────────────────────────────
    public void deleteUser(String authId) {
        UserCredential user = repository.findById(authId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        repository.delete(user);
    }

    // ─── Reset another user's password (internal) ────────────────────
    public void resetUserPassword(String authId, String newPassword) {
        UserCredential user = repository.findById(authId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);
    }

    // ─── Change own password (internal) ──────────────────────────────
    public void changeOwnPassword(String authId, String oldPassword, String newPassword) {
        UserCredential user = repository.findById(authId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);
    }

    // ─── Get user ID by email (internal) ─────────────────────────────
    public String getIdByEmail(String email) {
        UserCredential user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }

    // ─── Check if email exists (internal) ────────────────────────────
    public boolean emailExists(String email) {
        return repository.existsByEmail(email);
    }

    // ─── Admin creates member ─────────────────────────────────────────
    public AuthResponse createMember(CreateMemberRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        UserCredential user = UserCredential.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.MEMBRE)
                .suspended(false)
                .build();
        repository.save(user);

        try {
            userServiceClient.createMemberProfile(
                    new InternalMemberRequest(
                            user.getId(),
                            request.getFirstName(),
                            request.getSecondName(),
                            request.getGender()
                    )
            );
        } catch (Exception e) {
            log.warn("Could not create member profile: {}", e.getMessage());
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}