package com.gym.userservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gym_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymClass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String coachId;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED

    @Column(nullable = false)
    private String dayOfWeek; // MONDAY, TUESDAY, etc.

    @Column(nullable = false)
    private String startTime; // e.g. "10:00"

    @Column(nullable = false)
    private String endTime; // e.g. "11:30"

    @Column(nullable = false)
    private int maxParticipants;

    @Column(nullable = false)
    private int currentParticipants = 0;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, CANCELLED

    @ElementCollection
    @CollectionTable(
            name = "gym_class_participants",
            joinColumns = @JoinColumn(name = "gym_class_id")
    )
    @Column(name = "member_id")
    @Builder.Default
    private List<String> participantIds = new ArrayList<>();
}