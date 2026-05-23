package com.gym.userservice.repository;

import com.gym.userservice.model.GymClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GymClassRepository extends JpaRepository<GymClass, String> {

    Page<GymClass> findByCoachId(String coachId, Pageable pageable);

    Page<GymClass> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<GymClass> findByCoachIdAndNameContainingIgnoreCase(
            String coachId, String name, Pageable pageable);

    // ── Search across all classes ──────────────────────────────────
    @Query("SELECT g FROM GymClass g WHERE " +
            "LOWER(g.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<GymClass> searchClasses(@Param("search") String search, Pageable pageable);

    // ── Search within a specific coach's classes ───────────────────
    @Query("SELECT g FROM GymClass g WHERE g.coachId = :coachId AND " +
            "LOWER(g.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<GymClass> searchClassesByCoach(
            @Param("coachId") String coachId,
            @Param("search") String search,
            Pageable pageable);

    boolean existsByCoachIdAndDayOfWeekAndStartTime(
            String coachId, String dayOfWeek, String startTime);
}