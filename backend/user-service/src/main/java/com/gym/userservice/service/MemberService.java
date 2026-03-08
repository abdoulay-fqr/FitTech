package com.gym.userservice.service;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Member;
import com.gym.userservice.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository repository;

    // ─── Create member ───────────────────────────────────────────────
    public Member createMember(CreateMemberRequest request) {
        if (repository.existsByAuthId(request.getAuthId())) {
            throw new RuntimeException("Member already exists");
        }
        Member member = Member.builder()
                .authId(request.getAuthId())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())        // ──► ADD THIS
                .objective(request.getObjective())
                .medicalRestrictions(request.getMedicalRestrictions())
                .nfcActive(false)
                .suspended(false)
                .build();
        return repository.save(member);
    }

    // ─── Get all members ─────────────────────────────────────────────
    public List<Member> getAllMembers() {
        return repository.findAll();
    }

    // ─── Get member by id ────────────────────────────────────────────
    public Member getMemberById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    // ─── Get member by authId ────────────────────────────────────────
    public Member getMemberByAuthId(String authId) {
        return repository.findByAuthId(authId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    // ─── Update member ───────────────────────────────────────────────
    public Member updateMember(String id, UpdateMemberRequest request) {
        Member member = getMemberById(id);
        if (request.getFullName() != null) member.setFullName(request.getFullName());
        if (request.getPhone() != null) member.setPhone(request.getPhone());
        if (request.getBirthDate() != null) member.setBirthDate(request.getBirthDate());
        if (request.getGender() != null) member.setGender(request.getGender());  // ──► ADD HERE
        if (request.getObjective() != null) member.setObjective(request.getObjective());
        if (request.getMedicalRestrictions() != null) member.setMedicalRestrictions(request.getMedicalRestrictions());
        return repository.save(member);
    }

    // ─── Delete member ───────────────────────────────────────────────
    public void deleteMember(String id) {
        repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        repository.deleteById(id);
    }

    // ─── Suspend member ──────────────────────────────────────────────
    public void suspendMember(String id) {
        Member member = getMemberById(id);
        member.setSuspended(true);
        repository.save(member);
    }

    // ─── Unsuspend member ────────────────────────────────────────────
    public void unsuspendMember(String id) {
        Member member = getMemberById(id);
        member.setSuspended(false);
        repository.save(member);
    }

    // ─── Assign NFC card ─────────────────────────────────────────────
    public Member assignNfcCard(String id, NfcRequest request) {
        Member member = getMemberById(id);
        member.setNfcCardId(request.getNfcCardId());
        member.setNfcActive(true);
        return repository.save(member);
    }

    // ─── Deactivate NFC card ─────────────────────────────────────────
    public Member deactivateNfcCard(String id) {
        Member member = getMemberById(id);
        member.setNfcActive(false);
        return repository.save(member);
    }

    // ─── Check NFC card ──────────────────────────────────────────────
    public boolean checkNfcAccess(String nfcCardId) {
        return repository.findByNfcCardId(nfcCardId)
                .map(member -> member.isNfcActive() && !member.isSuspended())
                .orElse(false);
    }
}
