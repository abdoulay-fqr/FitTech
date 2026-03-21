package com.gym.apigateway.filter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.HandlerFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

    private final JwtUtil jwtUtil;

    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/auth/register",
            "/auth/login",
            "/auth/forgot-password",
            "/auth/reset-password",
            "/users/members/nfc/check",
            "/users/trials",
            "/users/trials/check",
            "/users/members/internal",
            "/users/coaches/internal",
            "/users/admins/internal",
            "/auth/internal"
    );

    @Override
    public ServerResponse filter(ServerRequest request,
                                 HandlerFunction<ServerResponse> next) throws Exception {

        String path = request.uri().getPath();

        boolean isPublic = PUBLIC_ENDPOINTS.stream()
                .anyMatch(path::startsWith);

        if (isPublic) {
            return next.handle(request);
        }

        String authHeader = request.headers().firstHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ServerResponse.status(401)
                    .body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            return ServerResponse.status(401)
                    .body("Invalid or expired token");
        }

        String userId = jwtUtil.extractId(token);
        String role = jwtUtil.extractRole(token);
        String finalAuthHeader = authHeader;

        log.info("Gateway: path={}, userId={}, role={}", path, userId, role);

        ServerRequest mutatedRequest = ServerRequest.from(request)
                .headers(headers -> {
                    headers.set("X-User-Id", userId);
                    headers.set("X-User-Role", role);
                    headers.set("Authorization", finalAuthHeader);
                })
                .build();

        return next.handle(mutatedRequest);
    }
}