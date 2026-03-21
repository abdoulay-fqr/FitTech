package com.gym.userservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coaches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String authId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String secondName;

    private String phone;

    private String birthDate;

    private String gender;

    private String specialties;

    private String biography;

    @Column
    private String profilePic;
}