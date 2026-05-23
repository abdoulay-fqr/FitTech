package com.gym.userservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class GymClassDTO {
    private String id;
    private String coachId;
    private String name;
    private String description;
    private String level;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private int maxParticipants;
    private int currentParticipants;
    private String status;
    private List<String> participantIds;
}