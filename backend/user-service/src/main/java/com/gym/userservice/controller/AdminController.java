package com.gym.userservice.controller;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Admin;
import com.gym.userservice.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Admin> createAdmin(
            @Valid @RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(adminService.createAdmin(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Admin> getAdminById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    @GetMapping("/auth/{authId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Admin> getAdminByAuthId(@PathVariable String authId) {
        return ResponseEntity.ok(adminService.getAdminByAuthId(authId));
    }
}