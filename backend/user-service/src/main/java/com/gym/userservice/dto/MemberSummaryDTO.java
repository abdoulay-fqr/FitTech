package com.gym.userservice.dto;

import lombok.Data;

@Data
public class MemberSummaryDTO {
    private String id;
    private String firstName;
    private String secondName;
    private String email;
    private String gender;
    private String subscriptionPlan;
    private String subscriptionStatus;
    private String profilePic;
}