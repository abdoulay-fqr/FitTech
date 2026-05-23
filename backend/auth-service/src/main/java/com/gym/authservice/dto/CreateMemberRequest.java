package com.gym.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateMemberRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Second name is required")
    private String secondName;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String phone;
    private String birthDate;
    private String gender;
    private String objective;
    private String medicalRestrictions;
}