package com.esi.msuniversite.Proxy;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.client.HttpGraphQlClient;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class GraphQlClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder loadBalancedWebClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public HttpGraphQlClient formationGraphQlClient(WebClient.Builder webClientBuilder) {

        WebClient webClient = webClientBuilder
                .baseUrl("http://ms-formation/graphql")
                .build();

        return HttpGraphQlClient.builder(webClient).build();
    }
}