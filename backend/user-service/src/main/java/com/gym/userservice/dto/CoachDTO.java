package com.gym.userservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class CoachDTO {
    private String id;
    private String authId;
    private String firstName;
    private String secondName;
    private String phone;
    private String birthDate;
    private String gender;
    private String specialties;
    private String biography;
    private String profilePic;
    private List<GymClassDTO> gymClasses;
}