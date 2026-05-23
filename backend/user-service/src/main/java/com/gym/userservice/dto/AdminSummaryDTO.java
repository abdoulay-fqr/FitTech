package com.gym.userservice.dto;

import lombok.Data;

@Data
public class AdminSummaryDTO {
    private String id;
    private String firstName;
    private String secondName;
    private String email;
    private String gender;
    private String profilePic;
    private boolean superAdmin;
}