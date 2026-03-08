package com.gym.userservice.dto;

import lombok.Data;

@Data
public class UpdateMemberRequest {
    private String fullName;
    private String phone;
    private String birthDate;
    private String objective;
    private String medicalRestrictions;
    private String gender;
}