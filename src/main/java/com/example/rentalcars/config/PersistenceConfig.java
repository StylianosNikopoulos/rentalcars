package com.example.rentalcars.config;

import com.example.rentalcars.core.util.TimeProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;

@Configuration
public class PersistenceConfig {

    @Bean
    public TimeProvider timeProvider() {
        return Instant::now;
    }
}