package com.gym.userservice.dto;

import lombok.Data;

@Data
public class UpdateCoachRequest {
    private String fullName;
    private String phone;
    private String specialties;
    private String biography;
}
