package com.example.rentalcars.features.vehicle.domain.model;

import com.example.rentalcars.core.domain.AggregateRoot;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class VehicleImage extends AggregateRoot {
    private String url;
    private boolean isMain;

    @Builder
    public VehicleImage(UUID id, java.time.LocalDateTime createdAt, java.time.LocalDateTime updatedAt,
                        String url, boolean isMain) {
        super(id, createdAt, updatedAt);
        this.url = url;
        this.isMain = isMain;
    }
}