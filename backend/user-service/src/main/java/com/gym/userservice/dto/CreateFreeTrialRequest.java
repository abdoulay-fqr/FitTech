package com.gym.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateFreeTrialRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Address is required")
    private String address;
}