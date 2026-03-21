package com.gym.userservice.dto;

import lombok.Data;

@Data
public class UpdateGymClassRequest {
    private String name;
    private String description;
    private String level;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private Integer maxParticipants;
    private String status;
}