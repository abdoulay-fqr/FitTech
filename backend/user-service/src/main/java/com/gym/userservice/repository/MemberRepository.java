package com.gym.userservice.repository;

import com.gym.userservice.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByAuthId(String authId);
    boolean existsByAuthId(String authId);
    Optional<Member> findByNfcCardId(String nfcCardId);
}
