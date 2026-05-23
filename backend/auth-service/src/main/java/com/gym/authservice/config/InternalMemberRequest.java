package com.gym.authservice.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InternalMemberRequest {
    private String authId;
    private String firstName;
    private String secondName;
    private String gender;
}