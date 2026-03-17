package com.gym.userservice.repository;

import com.gym.userservice.model.FreeTrial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FreeTrialRepository extends JpaRepository<FreeTrial, String> {

    boolean existsByEmail(String email);
    Optional<FreeTrial> findByEmail(String email);
}
