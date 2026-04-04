package com.example.rentalcars.features.vehicle.infrastructure.adapter.inbound.rest.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleImageResponse {
    private String url;
    private boolean isMain;
}
