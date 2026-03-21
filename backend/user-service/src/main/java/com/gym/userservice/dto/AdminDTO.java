package com.gym.userservice.dto;

import lombok.Data;

@Data
public class AdminDTO {
    private String id;
    private String authId;
    private String firstName;
    private String secondName;
    private String phone;
    private String birthDate;
    private String gender;
    private String profilePic;
    private boolean superAdmin;
}