package com.gym.authservice.dto;

import lombok.Data;

@Data
public class CreateCoachRequest {
    private String email;
    private String password;
    private String firstName;
    private String secondName;
    private String phone;
    private String birthDate;
    private String gender;
    private String specialties;
    private String biography;
}