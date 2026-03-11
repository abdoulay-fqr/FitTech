package com.gym.authservice.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InternalAdminRequest {
    private String authId;
    private String fullName;
    private String phone;
}