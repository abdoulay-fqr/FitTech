package com.gym.userservice.service;

import com.gym.userservice.dto.*;
import com.gym.userservice.model.Member;
import com.gym.userservice.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository repository;

    // ─── Create member ───────────────────────────────────────────────
    public Member createMember(CreateMemberRequest request) {
        Member member = Member.builder()
                .firstName(request.getFirstName())
                .secondName(request.getSecondName())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .objective(request.getObjective())
                .medicalRestrictions(request.getMedicalRestrictions())
                .nfcActive(false)
                .suspended(false)
                .build();
        return repository.save(member);
    }

    @Transactional(readOnly = true)
    public Page<Member> getAllMembers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            return repository.searchMembers(search, pageable);
        }
        return repository.findAll(pageable);
    }
    // ─── Get member by id ────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Member getMemberById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    // ─── Update member ───────────────────────────────────────────────
    public Member updateMember(String id, UpdateMemberRequest request) {
        Member member = getMemberById(id);
        if (request.getFirstName() != null) member.setFirstName(request.getFirstName());
        if (request.getSecondName() != null) member.setSecondName(request.getSecondName());
        if (request.getPhone() != null) member.setPhone(request.getPhone());
        if (request.getBirthDate() != null) member.setBirthDate(request.getBirthDate());
        if (request.getGender() != null) member.setGender(request.getGender());
        if (request.getObjective() != null) member.setObjective(request.getObjective());
        if (request.getMedicalRestrictions() != null) member.setMedicalRestrictions(request.getMedicalRestrictions());
        if (request.getSubscriptionPlan() != null) member.setSubscriptionPlan(request.getSubscriptionPlan());
        if (request.getSubscriptionStatus() != null) member.setSubscriptionStatus(request.getSubscriptionStatus());
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
    @Transactional(readOnly = true)
    public boolean checkNfcAccess(String nfcCardId) {
        return repository.findByNfcCardId(nfcCardId)
                .map(member -> member.isNfcActive() && !member.isSuspended())
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public Member getMemberByAuthId(String authId) {
        return repository.findByAuthId(authId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }
}