package com.gym.authservice.dto;

import lombok.Data;

@Data
public class InternalAuthRegisterRequest {
    private String email;
    private String password;
}