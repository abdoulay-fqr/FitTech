package com.gym.authservice.dto;

import lombok.Data;

@Data
public class CreateCoachRequest {
    private String email;
    private String password;
    // ──► profile fields sent to user-service
    private String fullName;
    private String phone;
    private String specialties;
    private String biography;
}