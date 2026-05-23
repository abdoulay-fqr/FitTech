package com.gym.userservice.repository;

import com.gym.userservice.model.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {

    Optional<Member> findByAuthId(String authId);

    boolean existsByAuthId(String authId);

    Optional<Member> findByNfcCardId(String nfcCardId);

    // ── Search by firstName, secondName ───────────────────
    @Query("SELECT m FROM Member m WHERE " +
            "LOWER(m.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(m.secondName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CONCAT(m.firstName, ' ', m.secondName)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(m.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Member> searchMembers(@Param("search") String search, Pageable pageable);
}