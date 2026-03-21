package com.gym.userservice.controller;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.GymClass;
import com.gym.userservice.service.GymClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/classes")
@RequiredArgsConstructor
public class GymClassController {

    private final GymClassService gymClassService;

    // ─── Create class (Coach creates for themselves, Admin assigns to coach) ──
    @PostMapping
    public ResponseEntity<?> createClass(
            Authentication authentication,
            @RequestBody CreateGymClassRequest request) {

        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String authId = (String) authentication.getCredentials();

        if (role.equals("ROLE_COACH")) {
            return ResponseEntity.ok(gymClassService.createClass(authId, request));
        } else if (role.equals("ROLE_ADMIN") || role.equals("ROLE_SUPER_ADMIN")) {
            if (request.getCoachId() == null) {
                return ResponseEntity.badRequest().body("coachId is required for admin class creation");
            }
            return ResponseEntity.ok(gymClassService.createClass(request.getCoachId(), request));
        }
        return ResponseEntity.status(403).body("Access denied");
    }

    @PutMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<GymClass> updateClass(
            @PathVariable String id,
            @RequestBody UpdateGymClassRequest request) {
        return ResponseEntity.ok(gymClassService.updateClass(id, request));
    }

    @PostMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}/participants/{memberId}")
    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<GymClass> addParticipant(
            @PathVariable String id,
            @PathVariable String memberId) {
        return ResponseEntity.ok(gymClassService.addParticipant(id, memberId));
    }

    @DeleteMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}/participants/{memberId}")
    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<GymClass> removeParticipant(
            @PathVariable String id,
            @PathVariable String memberId) {
        return ResponseEntity.ok(gymClassService.removeParticipant(id, memberId));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<PagedResponse<GymClass>> getAllClasses(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(PagedResponseUtil.of(gymClassService.getAllClasses(search, page, size)));
    }

    @GetMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<GymClass> getClassById(@PathVariable String id) {
        return ResponseEntity.ok(gymClassService.getClassById(id));
    }

    @DeleteMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> deleteClass(@PathVariable String id) {
        gymClassService.deleteClass(id);
        return ResponseEntity.ok("Class deleted successfully");
    }

    @GetMapping("/coach/{coachId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<PagedResponse<GymClass>> getClassesByCoach(
            @PathVariable String coachId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(PagedResponseUtil.of(gymClassService.getClassesByCoach(coachId, search, page, size)));
    }
}