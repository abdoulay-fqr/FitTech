package com.gym.authservice.dto;

import lombok.Data;

@Data
public class CreateAdminRequest {
    private String fullName;
    private String phone;
    private String email;
    private String password;
}