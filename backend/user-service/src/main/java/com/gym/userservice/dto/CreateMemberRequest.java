package com.gym.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateMemberRequest {
    private String authId;
    private String fullName;
    private String phone;
    private String birthDate;
    private String gender;
    private String objective;
    private String medicalRestrictions;
}
