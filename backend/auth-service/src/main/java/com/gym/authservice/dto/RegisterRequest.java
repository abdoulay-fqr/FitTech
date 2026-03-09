package com.gym.authservice.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    // ──► profile fields sent to user-service
    private String firstName;
    private String secondName;
    private String gender; // "MALE" or "FEMALE"
}