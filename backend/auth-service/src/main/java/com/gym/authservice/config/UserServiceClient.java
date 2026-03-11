package com.gym.authservice.config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
@FeignClient(name = "user-service", url = "http://localhost:8082")
public interface UserServiceClient {

    @PostMapping("/users/members/internal")
    void createMemberProfile(@RequestBody InternalMemberRequest request);

    @PostMapping("/users/coaches/internal")
    void createCoachProfile(@RequestBody InternalCoachRequest request);

    @PostMapping("/users/admins/internal")
    void createAdminProfile(@RequestBody InternalAdminRequest request);
}