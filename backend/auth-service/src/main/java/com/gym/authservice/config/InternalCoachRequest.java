package com.gym.authservice.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InternalCoachRequest {
    private String authId;
    private String firstName;
    private String secondName;
    private String phone;
    private String birthDate;
    private String gender;
    private String specialties;
    private String biography;
}