package com.gym.userservice.config;

import com.gym.userservice.model.*;
import com.gym.userservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final AdminRepository adminRepository;
    private final CoachRepository coachRepository;
    private final MemberRepository memberRepository;
    private final GymClassRepository gymClassRepository;
    private final FreeTrialRepository freeTrialRepository;
    private final AuthServiceClient authServiceClient;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            initAdmins();
            initCoaches();
            initMembers();
            initGymClasses();
            initFreeTrials();
        };
    }

    // ─── Admins ──────────────────────────────────────────────────────
    private void initAdmins() {
        if (adminRepository.count() > 0) return;

        String superAdminId = authServiceClient.getIdByEmail("superadmin@gym.com");
        String admin1Id = authServiceClient.getIdByEmail("admin1@gym.com");
        String admin2Id = authServiceClient.getIdByEmail("admin2@gym.com");

        adminRepository.saveAll(List.of(
                Admin.builder()
                        .authId(superAdminId)
                        .firstName("Super").secondName("Admin")
                        .phone("0550000000").birthDate("1985-01-01")
                        .gender("MALE").superAdmin(true).build(),

                Admin.builder()
                        .authId(admin1Id)
                        .firstName("Karim").secondName("Boudiaf")
                        .phone("0551111111").birthDate("1990-03-15")
                        .gender("MALE").superAdmin(false).build(),

                Admin.builder()
                        .authId(admin2Id)
                        .firstName("Sara").secondName("Meddah")
                        .phone("0552222222").birthDate("1992-07-20")
                        .gender("FEMALE").superAdmin(false).build()
        ));
        log.info("✅ Admins initialized");
    }

    // ─── Coaches ─────────────────────────────────────────────────────
    private void initCoaches() {
        if (coachRepository.count() > 0) return;

        String coach1Id = authServiceClient.getIdByEmail("coach1@gym.com");
        String coach2Id = authServiceClient.getIdByEmail("coach2@gym.com");
        String coach3Id = authServiceClient.getIdByEmail("coach3@gym.com");

        coachRepository.saveAll(List.of(
                Coach.builder()
                        .authId(coach1Id)
                        .firstName("Ahmed").secondName("Benali")
                        .phone("0553333333").birthDate("1988-05-10")
                        .gender("MALE")
                        .specialties("Cardio, HIIT, Spinning")
                        .biography("Certified fitness coach with 10 years of experience specializing in high-intensity training and weight loss programs.")
                        .build(),

                Coach.builder()
                        .authId(coach2Id)
                        .firstName("Yasmine").secondName("Khelif")
                        .phone("0554444444").birthDate("1991-09-25")
                        .gender("FEMALE")
                        .specialties("Yoga, Pilates, Stretching")
                        .biography("Passionate yoga instructor with 8 years of experience helping students improve flexibility and find inner balance.")
                        .build(),

                Coach.builder()
                        .authId(coach3Id)
                        .firstName("Rami").secondName("Saidi")
                        .phone("0555555555").birthDate("1986-12-03")
                        .gender("MALE")
                        .specialties("Bodybuilding, Strength Training, CrossFit")
                        .biography("Professional bodybuilder and strength coach with expertise in muscle building and performance optimization.")
                        .build()
        ));
        log.info("✅ Coaches initialized");
    }

    // ─── Members ─────────────────────────────────────────────────────
    private void initMembers() {
        if (memberRepository.count() > 0) return;

        String member1Id = authServiceClient.getIdByEmail("member1@gym.com");
        String member2Id = authServiceClient.getIdByEmail("member2@gym.com");
        String member3Id = authServiceClient.getIdByEmail("member3@gym.com");
        String member4Id = authServiceClient.getIdByEmail("member4@gym.com");
        String member5Id = authServiceClient.getIdByEmail("member5@gym.com");

        memberRepository.saveAll(List.of(
                Member.builder()
                        .authId(member1Id)
                        .firstName("Ali").secondName("Bensalem")
                        .phone("0556666666").birthDate("1995-02-14")
                        .gender("MALE")
                        .objective("Weight loss and improved cardio endurance")
                        .medicalRestrictions("None")
                        .subscriptionPlan("MONTHLY").subscriptionStatus("ACTIVE")
                        .nfcCardId("NFC-001").nfcActive(true).suspended(false).build(),

                Member.builder()
                        .authId(member2Id)
                        .firstName("Lina").secondName("Hamdi")
                        .phone("0557777777").birthDate("1998-06-30")
                        .gender("FEMALE")
                        .objective("Improve flexibility and reduce stress")
                        .medicalRestrictions("Lower back pain, avoid heavy lifting")
                        .subscriptionPlan("ANNUAL").subscriptionStatus("ACTIVE")
                        .nfcCardId("NFC-002").nfcActive(true).suspended(false).build(),

                Member.builder()
                        .authId(member3Id)
                        .firstName("Omar").secondName("Zouari")
                        .phone("0558888888").birthDate("1993-11-08")
                        .gender("MALE")
                        .objective("Build muscle mass and increase strength")
                        .medicalRestrictions("None")
                        .subscriptionPlan("MONTHLY").subscriptionStatus("EXPIRED")
                        .nfcCardId("NFC-003").nfcActive(false).suspended(false).build(),

                Member.builder()
                        .authId(member4Id)
                        .firstName("Nadia").secondName("Ferhat")
                        .phone("0559999999").birthDate("2000-04-17")
                        .gender("FEMALE")
                        .objective("General fitness and healthy lifestyle")
                        .medicalRestrictions("Asthma, avoid high intensity cardio")
                        .subscriptionPlan("SESSION").subscriptionStatus("ACTIVE")
                        .nfcCardId("NFC-004").nfcActive(true).suspended(false).build(),

                Member.builder()
                        .authId(member5Id)
                        .firstName("Youssef").secondName("Gharbi")
                        .phone("0550000001").birthDate("1997-08-22")
                        .gender("MALE")
                        .objective("Lose weight and tone muscles")
                        .medicalRestrictions("None")
                        .subscriptionPlan("MONTHLY").subscriptionStatus("ACTIVE")
                        .nfcCardId("NFC-005").nfcActive(true).suspended(true).build()
        ));
        log.info("✅ Members initialized");
    }

    // ─── Gym Classes ─────────────────────────────────────────────────
    private void initGymClasses() {
        if (gymClassRepository.count() > 0) return;

        List<Coach> coaches = coachRepository.findAll();
        if (coaches.size() < 3) return;

        String coach1Id = coaches.get(0).getId();
        String coach2Id = coaches.get(1).getId();
        String coach3Id = coaches.get(2).getId();

        gymClassRepository.saveAll(List.of(
                GymClass.builder()
                        .coachId(coach1Id).name("Morning HIIT")
                        .description("High intensity interval training to kickstart your day and boost your metabolism.")
                        .level("INTERMEDIATE").dayOfWeek("MONDAY")
                        .startTime("07:00").endTime("08:00")
                        .maxParticipants(20).currentParticipants(12)
                        .status("ACTIVE").build(),

                GymClass.builder()
                        .coachId(coach1Id).name("Spinning Session")
                        .description("High-energy indoor cycling session with motivating music and interval training.")
                        .level("BEGINNER").dayOfWeek("WEDNESDAY")
                        .startTime("09:00").endTime("10:00")
                        .maxParticipants(15).currentParticipants(15)
                        .status("ACTIVE").build(),

                GymClass.builder()
                        .coachId(coach2Id).name("Morning Yoga")
                        .description("Gentle yoga session to improve flexibility and start your day with a clear mind.")
                        .level("BEGINNER").dayOfWeek("TUESDAY")
                        .startTime("08:00").endTime("09:00")
                        .maxParticipants(12).currentParticipants(8)
                        .status("ACTIVE").build(),

                GymClass.builder()
                        .coachId(coach2Id).name("Pilates Core")
                        .description("Focus on core strength, posture, and controlled movements for a stronger body.")
                        .level("INTERMEDIATE").dayOfWeek("THURSDAY")
                        .startTime("10:00").endTime("11:00")
                        .maxParticipants(10).currentParticipants(6)
                        .status("ACTIVE").build(),

                GymClass.builder()
                        .coachId(coach3Id).name("CrossFit Challenge")
                        .description("Intense functional fitness workout combining strength, cardio and agility exercises.")
                        .level("ADVANCED").dayOfWeek("FRIDAY")
                        .startTime("06:00").endTime("07:30")
                        .maxParticipants(10).currentParticipants(9)
                        .status("ACTIVE").build(),

                GymClass.builder()
                        .coachId(coach3Id).name("Strength Basics")
                        .description("Learn the fundamental movements of strength training with proper form and technique.")
                        .level("BEGINNER").dayOfWeek("SATURDAY")
                        .startTime("11:00").endTime("12:00")
                        .maxParticipants(15).currentParticipants(0)
                        .status("CANCELLED").build()
        ));
        log.info("✅ Gym classes initialized");
    }

    // ─── Free Trials ─────────────────────────────────────────────────
    private void initFreeTrials() {
        if (freeTrialRepository.count() > 0) return;

        freeTrialRepository.saveAll(List.of(
                FreeTrial.builder()
                        .fullName("Hamza Belkacem")
                        .email("hamza.belkacem@gmail.com")
                        .createdAt(LocalDateTime.now().minusDays(5))
                        .used(false).build(),

                FreeTrial.builder()
                        .fullName("Amina Ouali")
                        .email("amina.ouali@gmail.com")
                        .createdAt(LocalDateTime.now().minusDays(3))
                        .used(true).build(),

                FreeTrial.builder()
                        .fullName("Bilal Mansouri")
                        .email("bilal.mansouri@gmail.com")
                        .createdAt(LocalDateTime.now().minusDays(7))
                        .used(false).build(),

                FreeTrial.builder()
                        .fullName("Soraya Hadj")
                        .email("soraya.hadj@gmail.com")
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .used(true).build(),

                FreeTrial.builder()
                        .fullName("Mehdi Cherif")
                        .email("mehdi.cherif@gmail.com")
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .used(false).build()
        ));
        log.info("✅ Free trials initialized");
    }
}