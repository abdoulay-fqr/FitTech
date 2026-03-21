package com.gym.userservice.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InternalAuthRequest {
    private String email;
    private String password;
    private String role;
}