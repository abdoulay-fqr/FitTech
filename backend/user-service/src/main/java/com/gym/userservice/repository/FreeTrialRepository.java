package com.gym.userservice.repository;

import com.gym.userservice.model.FreeTrial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FreeTrialRepository extends JpaRepository<FreeTrial, String> {

    boolean existsByEmail(String email);

    Optional<FreeTrial> findByEmail(String email);

    // ── Search across fullName, email, id ──────────────────────────
    @Query("SELECT f FROM FreeTrial f WHERE " +
            "LOWER(f.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(f.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(f.id) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<FreeTrial> searchTrials(@Param("search") String search, Pageable pageable);

    // ── Search with used filter ────────────────────────────────────
    @Query("SELECT f FROM FreeTrial f WHERE " +
            "f.used = :used AND (" +
            "LOWER(f.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(f.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(f.id) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<FreeTrial> searchTrialsByUsed(
            @Param("search") String search,
            @Param("used") boolean used,
            Pageable pageable);

    // ── Get all with used filter ───────────────────────────────────
    Page<FreeTrial> findByUsed(boolean used, Pageable pageable);

    // ── Get all sorted by used=false first ────────────────────────
    @Query("SELECT f FROM FreeTrial f ORDER BY f.used ASC, f.createdAt DESC")
    Page<FreeTrial> findAllOrderByUsedAsc(Pageable pageable);
}