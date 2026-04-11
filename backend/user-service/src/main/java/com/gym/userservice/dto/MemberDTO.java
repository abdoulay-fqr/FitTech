package com.gym.userservice.dto;

import lombok.Data;

@Data
public class MemberDTO {
    private String id;
    private String authId;
    private String email;
    private String firstName;
    private String secondName;
    private String phone;
    private String birthDate;
    private String gender;
    private String objective;
    private String medicalRestrictions;
    private String nfcCardId;
    private boolean nfcActive;
    private boolean suspended;
    private String subscriptionPlan;
    private String subscriptionStatus;
    private String profilePic;
}