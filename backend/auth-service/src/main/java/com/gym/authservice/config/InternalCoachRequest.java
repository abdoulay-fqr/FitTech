package com.gym.authservice.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InternalCoachRequest {
    private String authId;
    private String fullName;
    private String phone;
    private String specialties;
    private String biography;
}