package com.gym.userservice.repository;

import com.gym.userservice.model.Admin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

    Optional<Admin> findByAuthId(String authId);

    boolean existsByAuthId(String authId);

    // ── Search by firstName, secondName ───────────────────────────
    @Query("SELECT a FROM Admin a WHERE " +
            "LOWER(a.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(a.secondName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Admin> searchAdmins(@Param("search") String search, Pageable pageable);
}