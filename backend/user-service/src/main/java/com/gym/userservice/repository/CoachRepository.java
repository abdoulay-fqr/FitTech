package com.gym.userservice.repository;

import com.gym.userservice.model.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, String> {
    Optional<Coach> findByAuthId(String authId);
    boolean existsByAuthId(String authId);
}
