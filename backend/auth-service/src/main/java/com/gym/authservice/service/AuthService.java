package com.gym.authservice.service;


import com.gym.authservice.dto.*;
import com.gym.authservice.model.Role;
import com.gym.authservice.model.UserCredential;
import com.gym.authservice.repository.UserCredentialRepository;
import com.gym.authservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

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

        UserCredential coach = UserCredential.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.COACH)
                .suspended(false)
                .build();

        repository.save(coach);

        String token = jwtUtil.generateToken(
                coach.getId(),
                coach.getEmail(),
                coach.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .id(coach.getId())
                .email(coach.getEmail())
                .role(coach.getRole().name())
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

        // generate random token
        String token = java.util.UUID.randomUUID().toString();

        // save token + expiry (15 minutes)
        user.setResetToken(token);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        repository.save(user);

        // send email
        emailService.sendResetPasswordEmail(user.getEmail(), token);
    }

    // ─── Reset password ──────────────────────────────────────────────
    public void resetPassword(ResetPasswordRequest request) {
        UserCredential user = repository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        // check expiry
        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        // update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        repository.save(user);
    }
}
