package com.gym.userservice.dto;

import lombok.Data;

@Data
public class UpdateAdminRequest {
    private String firstName;
    private String secondName;
    private String phone;
    private String birthDate;
    private String gender;
}