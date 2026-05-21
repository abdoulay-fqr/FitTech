package com.gym.userservice.controller;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Admin;
import com.gym.userservice.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.gym.userservice.service.FileStorageService;

@RestController
@RequestMapping("/users/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    private final FileStorageService fileStorageService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<PagedResponse<Admin>> getAllAdmins(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(PagedResponseUtil.of(adminService.getAllAdmins(search, page, size)));
    }

    @GetMapping("/me")
    public ResponseEntity<Admin> getMyProfile(Authentication authentication) {
        System.out.println("=== GET /me called ===");
        System.out.println("Auth: " + authentication);
        String authId = (String) authentication.getCredentials();
        return ResponseEntity.ok(adminService.getAdminByAuthId(authId));
    }

    @GetMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Admin> getAdminById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Admin> createAdmin(
            @Valid @RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(adminService.createAdmin(request));
    }

    @PutMapping("/me")
    public ResponseEntity<Admin> updateMyProfile(
            Authentication authentication,
            @RequestBody UpdateAdminRequest request) {
        String authId = (String) authentication.getCredentials();
        Admin admin = adminService.getAdminByAuthId(authId);
        return ResponseEntity.ok(adminService.updateAdmin(admin.getId(), request));
    }

    @PutMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Admin> updateAdmin(
            @PathVariable String id,
            @RequestBody UpdateAdminRequest request) {
        return ResponseEntity.ok(adminService.updateAdmin(id, request));
    }

    @DeleteMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> deleteAdmin(@PathVariable String id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok("Admin deleted successfully");
    }

    @PostMapping("/internal")
    public ResponseEntity<Admin> createAdminInternal(
            @RequestBody InternalAdminRequest request) {
        CreateAdminRequest adminRequest = new CreateAdminRequest();
        adminRequest.setFirstName(request.getFirstName());
        adminRequest.setSecondName(request.getSecondName());
        adminRequest.setPhone(request.getPhone());
        return ResponseEntity.ok(adminService.createAdmin(adminRequest));
    }

    @GetMapping("/debug")
    public ResponseEntity<String> debug(
            org.springframework.security.core.Authentication authentication) {
        if (authentication == null) return ResponseEntity.ok("No auth");
        return ResponseEntity.ok("Name: " + authentication.getName() + " Roles: " + authentication.getAuthorities().toString());
    }

    @GetMapping("/debug2")
    public ResponseEntity<String> debug2(Authentication authentication) {
        return ResponseEntity.ok(
                "Principal: " + authentication.getName() +
                        " | Credentials: " + authentication.getCredentials() +
                        " | Roles: " + authentication.getAuthorities()
        );
    }

    @PostMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}/pic")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> uploadAdminPic(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            Admin admin = adminService.getAdminById(id);
            String path = fileStorageService.saveFile(file, "admins", admin.getId());
            adminService.updateProfilePic(id, path);
            return ResponseEntity.ok("Profile picture updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/me/pic")
    public ResponseEntity<String> uploadMyPic(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        try {
            String authId = (String) authentication.getCredentials();
            Admin admin = adminService.getAdminByAuthId(authId);
            String path = fileStorageService.saveFile(file, "admins", admin.getId());
            adminService.updateProfilePic(admin.getId(), path);
            return ResponseEntity.ok("Profile picture updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}