package com.gym.userservice.controller;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Member;
import com.gym.userservice.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // ─── Admin only ──────────────────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Member> createMember(
            @Valid @RequestBody CreateMemberRequest request) {
        return ResponseEntity.ok(memberService.createMember(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteMember(@PathVariable String id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok("Member deleted successfully");
    }

    @PutMapping("/suspend/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> suspendMember(@PathVariable String id) {
        memberService.suspendMember(id);
        return ResponseEntity.ok("Member suspended successfully");
    }

    @PutMapping("/unsuspend/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> unsuspendMember(@PathVariable String id) {
        memberService.unsuspendMember(id);
        return ResponseEntity.ok("Member unsuspended successfully");
    }

    @PutMapping("/nfc/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Member> assignNfcCard(
            @PathVariable String id,
            @Valid @RequestBody NfcRequest request) {
        return ResponseEntity.ok(memberService.assignNfcCard(id, request));
    }

    @PutMapping("/nfc/deactivate/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Member> deactivateNfcCard(@PathVariable String id) {
        return ResponseEntity.ok(memberService.deactivateNfcCard(id));
    }

    // ─── Member or Admin ─────────────────────────────────────────────
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEMBRE')")
    public ResponseEntity<Member> getMemberById(@PathVariable String id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @GetMapping("/auth/{authId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEMBRE')")
    public ResponseEntity<Member> getMemberByAuthId(@PathVariable String authId) {
        return ResponseEntity.ok(memberService.getMemberByAuthId(authId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEMBRE')")
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
}