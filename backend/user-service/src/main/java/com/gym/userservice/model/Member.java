package com.gym.userservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String authId;

    @Column(unique = true)
    private String email;

    @Column(nullable = true)
    private String firstName;

    @Column(nullable = true)
    private String secondName;

    private String phone;

    private String birthDate;

    private String objective;

    private String medicalRestrictions;

    @Column(unique = true)
    private String nfcCardId;

    @Column(nullable = false)
    private boolean nfcActive = false;

    @Column(nullable = false)
    private boolean suspended = false;

    @Column
    private String gender;

    @Column
    private String profilePic;

    @Column
    private String subscriptionPlan;

    @Column
    private String subscriptionStatus;
}