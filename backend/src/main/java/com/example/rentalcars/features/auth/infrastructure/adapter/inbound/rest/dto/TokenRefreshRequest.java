package com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenRefreshRequest {
    private String refreshToken;
}
