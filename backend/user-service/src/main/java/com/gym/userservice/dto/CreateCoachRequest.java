package com.gym.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCoachRequest {

    @NotBlank(message = "Auth ID is required")
    private String authId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;
    private String specialties;
    private String biography;
}