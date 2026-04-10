package com.gym.userservice.controller;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Member;
import com.gym.userservice.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.gym.userservice.service.FileStorageService;

@RestController
@RequestMapping("/users/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    private final FileStorageService fileStorageService;

    private static final String UUID_REGEX = "/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}";

    // ─── Admin only ──────────────────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Member> createMember(
            @Valid @RequestBody CreateMemberRequest request) {
        return ResponseEntity.ok(memberService.createMember(request));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<PagedResponse<Member>> getAllMembers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(PagedResponseUtil.of(memberService.getAllMembers(search, page, size)));
    }

    @DeleteMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> deleteMember(@PathVariable String id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok("Member deleted successfully");
    }

    @PutMapping("/suspend/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> suspendMember(@PathVariable String id) {
        memberService.suspendMember(id);
        return ResponseEntity.ok("Member suspended successfully");
    }

    @PutMapping("/unsuspend/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> unsuspendMember(@PathVariable String id) {
        memberService.unsuspendMember(id);
        return ResponseEntity.ok("Member unsuspended successfully");
    }

    @PutMapping("/nfc/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Member> assignNfcCard(
            @PathVariable String id,
            @Valid @RequestBody NfcRequest request) {
        return ResponseEntity.ok(memberService.assignNfcCard(id, request));
    }

    @PutMapping("/nfc/deactivate/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Member> deactivateNfcCard(@PathVariable String id) {
        return ResponseEntity.ok(memberService.deactivateNfcCard(id));
    }

    // ─── Member or Admin ─────────────────────────────────────────────
    @GetMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MEMBRE') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Member> getMemberById(@PathVariable String id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<Member> getMyProfile(Authentication authentication) {
        String authId = (String) authentication.getCredentials();
        return ResponseEntity.ok(memberService.getMemberByAuthId(authId));
    }

    @PutMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MEMBRE') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<Member> updateMember(
            @PathVariable String id,
            @RequestBody UpdateMemberRequest request) {
        return ResponseEntity.ok(memberService.updateMember(id, request));
    }

    // ─── NFC check (public for scanner) ─────────────────────────────
    @GetMapping("/nfc/check/{nfcCardId}")
    public ResponseEntity<Boolean> checkNfcAccess(
            @PathVariable String nfcCardId) {
        return ResponseEntity.ok(memberService.checkNfcAccess(nfcCardId));
    }

    // ─── Internal (called by auth-service only) ──────────────────────
    @PostMapping("/internal")
    public ResponseEntity<Member> createMemberInternal(
            @RequestBody InternalMemberRequest request) {
        return ResponseEntity.ok(memberService.createMemberInternal(request));
    }

    @PutMapping("/me")
    public ResponseEntity<Member> updateMyProfile(
            Authentication authentication,
            @RequestBody UpdateMemberRequest request) {
        String authId = (String) authentication.getCredentials();
        Member member = memberService.getMemberByAuthId(authId);
        return ResponseEntity.ok(memberService.updateMember(member.getId(), request));
    }

    @GetMapping("/debug-role")
    public ResponseEntity<String> debugRole(Authentication authentication) {
        if (authentication == null) return ResponseEntity.ok("No authentication");
        return ResponseEntity.ok("Role: " + authentication.getAuthorities().toString());
    }

    @PostMapping("/{id:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}/pic")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<String> uploadMemberPic(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            Member member = memberService.getMemberById(id);
            String path = fileStorageService.saveFile(file, "members", member.getId());
            memberService.updateProfilePic(id, path);
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
            Member member = memberService.getMemberByAuthId(authId);
            String path = fileStorageService.saveFile(file, "members", member.getId());
            memberService.updateProfilePic(member.getId(), path);
            return ResponseEntity.ok("Profile picture updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}