package com.gym.apigateway.config;

import com.gym.apigateway.filter.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class GatewayConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    // ─── Auth Service routes ─────────────────────────────────────────
    @Bean
    public RouterFunction<ServerResponse> authRoutes() {
        return GatewayRouterFunctions.route("auth-service")
                .route(RequestPredicates.path("/auth/**"),
                        HandlerFunctions.http())
                .before(BeforeFilterFunctions.uri("http://localhost:8081"))
                .before(request -> {
                    String authHeader = request.headers().firstHeader("Authorization");
                    if (authHeader != null) {
                        return ServerRequest.from(request)
                                .headers(headers -> headers.set("Authorization", authHeader))
                                .build();
                    }
                    return request;
                })
                .filter(jwtAuthFilter)
                .build();
    }

    // ─── User Service routes ─────────────────────────────────────────
    @Bean
    public RouterFunction<ServerResponse> userRoutes() {
        return GatewayRouterFunctions.route("user-service")
                .route(RequestPredicates.path("/users/**"),
                        HandlerFunctions.http())
                .before(BeforeFilterFunctions.uri("http://localhost:8082"))
                .before(request -> {
                    String authHeader = request.headers().firstHeader("Authorization");
                    if (authHeader != null) {
                        return ServerRequest.from(request)
                                .headers(headers -> headers.set("Authorization", authHeader))
                                .build();
                    }
                    return request;
                })
                .filter(jwtAuthFilter)
                .build();
    }
}