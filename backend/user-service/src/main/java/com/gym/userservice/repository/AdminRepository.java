package com.gym.userservice.repository;

import com.gym.userservice.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByAuthId(String authId);
    boolean existsByAuthId(String authId);
}