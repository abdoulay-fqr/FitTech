package com.gym.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InternalAdminRequest {
    private String authId;
    private String fullName;
    private String phone;
}