package com.gym.userservice.service;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Admin;
import com.gym.userservice.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository repository;

    // ─── Create admin ────────────────────────────────────────────────
    public Admin createAdmin(CreateAdminRequest request) {
        Admin admin = Admin.builder()
                .firstName(request.getFirstName())
                .secondName(request.getSecondName())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .superAdmin(false)
                .build();
        return repository.save(admin);
    }

    // ─── Get all admins ──────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Page<Admin> getAllAdmins(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            return repository.searchAdmins(search, pageable);
        }
        return repository.findAll(pageable);
    }

    // ─── Get admin by id ─────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Admin getAdminById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    // ─── Get admin by authId ─────────────────────────────────────────
    @Transactional(readOnly = true)
    public Admin getAdminByAuthId(String authId) {
        return repository.findByAuthId(authId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    // ─── Update admin ────────────────────────────────────────────────
    public Admin updateAdmin(String id, UpdateAdminRequest request) {
        Admin admin = getAdminById(id);
        if (request.getFirstName() != null) admin.setFirstName(request.getFirstName());
        if (request.getSecondName() != null) admin.setSecondName(request.getSecondName());
        if (request.getPhone() != null) admin.setPhone(request.getPhone());
        if (request.getBirthDate() != null) admin.setBirthDate(request.getBirthDate());
        if (request.getGender() != null) admin.setGender(request.getGender());
        return repository.save(admin);
    }

    // ─── Delete admin ────────────────────────────────────────────────
    public void deleteAdmin(String id) {
        repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        repository.deleteById(id);
    }
}