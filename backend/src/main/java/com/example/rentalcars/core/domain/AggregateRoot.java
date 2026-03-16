package com.example.rentalcars.core.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public abstract class AggregateRoot extends BaseEntity {
    protected AggregateRoot() { super(); }

    protected AggregateRoot(UUID id, LocalDateTime createdAt, LocalDateTime updatedAt) {
        super(id, createdAt, updatedAt);
    }
}