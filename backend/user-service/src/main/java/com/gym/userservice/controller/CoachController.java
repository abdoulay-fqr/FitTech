package com.gym.userservice.controller;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Coach;
import com.gym.userservice.service.CoachService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.gym.userservice.service.FileStorageService;

@RestController
@RequestMapping("/users/coaches")
@RequiredArgsConstructor
public class CoachController {

    private final CoachService coachService;

    private final FileStorageService fileStorageService;

    // ─── Admin only ──────────────────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Coach> createCoach(
            @Valid @RequestBody CreateCoachRequest request) {
        return ResponseEntity.ok(coachService.createCoach(request));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<PagedResponse<Coach>> getAllCoaches(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(PagedResponseUtil.of(coachService.getAllCoaches(search, page, size)));
    }

    @DeleteMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> deleteCoach(@PathVariable String id) {
        coachService.deleteCoach(id);
        return ResponseEntity.ok("Coach deleted successfully");
    }

    // ─── Admin or Coach ──────────────────────────────────────────────
    @GetMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Coach> getCoachById(@PathVariable String id) {
        return ResponseEntity.ok(coachService.getCoachById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<Coach> getMyProfile(Authentication authentication) {
        String authId = (String) authentication.getCredentials();
        return ResponseEntity.ok(coachService.getCoachByAuthId(authId));
    }

    @PutMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Coach> updateCoach(
            @PathVariable String id,
            @RequestBody UpdateCoachRequest request) {
        return ResponseEntity.ok(coachService.updateCoach(id, request));
    }

    @PostMapping("/internal")
    public ResponseEntity<Coach> createCoachInternal(
            @RequestBody InternalCoachRequest request) {
        CreateCoachRequest coachRequest = new CreateCoachRequest();
        coachRequest.setFirstName(request.getFirstName());
        coachRequest.setSecondName(request.getSecondName());
        coachRequest.setPhone(request.getPhone());
        coachRequest.setSpecialties(request.getSpecialties());
        coachRequest.setBiography(request.getBiography());
        return ResponseEntity.ok(coachService.createCoach(coachRequest));
    }

    @PutMapping("/me")
    public ResponseEntity<Coach> updateMyProfile(
            Authentication authentication,
            @RequestBody UpdateCoachRequest request) {
        String authId = (String) authentication.getCredentials();
        Coach coach = coachService.getCoachByAuthId(authId);
        return ResponseEntity.ok(coachService.updateCoach(coach.getId(), request));
    }

    @PostMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}/pic")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> uploadCoachPic(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            Coach coach = coachService.getCoachById(id);
            String path = fileStorageService.saveFile(file, "coaches", coach.getId());
            coachService.updateProfilePic(id, path);
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
            Coach coach = coachService.getCoachByAuthId(authId);
            String path = fileStorageService.saveFile(file, "coaches", coach.getId());
            coachService.updateProfilePic(coach.getId(), path);
            return ResponseEntity.ok("Profile picture updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}