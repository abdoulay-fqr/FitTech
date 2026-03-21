package com.gym.userservice.dto;

import lombok.Data;

@Data
public class UpdateCoachRequest {
    private String firstName;
    private String secondName;
    private String phone;
    private String birthDate;
    private String gender;
    private String specialties;
    private String biography;
}