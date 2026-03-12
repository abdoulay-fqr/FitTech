package com.gym.userservice.repository;

import com.gym.userservice.model.FreeTrial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FreeTrialRepository extends JpaRepository<FreeTrial, String> {

    boolean existsByEmail(String email);
}
