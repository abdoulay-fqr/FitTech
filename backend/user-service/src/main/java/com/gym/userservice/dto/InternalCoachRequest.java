package com.gym.userservice.dto;

import lombok.Data;

@Data
public class InternalCoachRequest {
    private String authId;
    private String fullName;
    private String phone;
    private String specialties;
    private String biography;
}