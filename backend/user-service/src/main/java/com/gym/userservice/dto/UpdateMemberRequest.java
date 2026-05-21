package com.gym.userservice.dto;

import lombok.Data;

@Data
public class UpdateMemberRequest {
    private String firstName;
    private String secondName;
    private String phone;
    private String birthDate;
    private String gender;
    private String objective;
    private String medicalRestrictions;
    private String subscriptionPlan;
    private String subscriptionStatus;
}