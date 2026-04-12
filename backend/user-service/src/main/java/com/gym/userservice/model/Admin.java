package com.gym.userservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String authId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String secondName;

    @Column(unique = true)
    private String email;

    private String phone;

    private String birthDate;

    private String gender;

    @Column
    private String profilePic;

    @Column(nullable = false)
    private boolean superAdmin = false;
}