package com.gym.userservice.repository;

import com.gym.userservice.model.Coach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, String> {

    Optional<Coach> findByAuthId(String authId);

    boolean existsByAuthId(String authId);

    // ── Search by firstName, secondName ───────────────────────────
    @Query("SELECT c FROM Coach c WHERE " +
            "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.secondName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Coach> searchCoaches(@Param("search") String search, Pageable pageable);
}