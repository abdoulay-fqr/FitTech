package com.gym.userservice.service;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Admin;
import com.gym.userservice.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository repository;

    // ─── Create admin ────────────────────────────────────────────────
    public Admin createAdmin(CreateAdminRequest request) {
        if (repository.existsByAuthId(request.getAuthId())) {
            throw new RuntimeException("Admin already exists");
        }
        Admin admin = Admin.builder()
                .authId(request.getAuthId())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .build();
        return repository.save(admin);
    }

    // ─── Get all admins ──────────────────────────────────────────────
    public List<Admin> getAllAdmins() {
        return repository.findAll();
    }

    // ─── Get admin by id ─────────────────────────────────────────────
    public Admin getAdminById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    // ─── Get admin by authId ─────────────────────────────────────────
    public Admin getAdminByAuthId(String authId) {
        return repository.findByAuthId(authId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }
}