package com.example.rentalcars.core.valueobject;

import com.example.rentalcars.core.exception.BusinessException;
import java.time.LocalDateTime;
import java.time.Duration;

public record DateRange(LocalDateTime start, LocalDateTime end) {
    public DateRange {
        if (start == null || end == null) throw new IllegalArgumentException("Dates cannot be null");
        if (start.isAfter(end)) {
            throw new BusinessException("Start date must be before end date", "INVALID_DATE_RANGE");
        }
    }

    public long toDays() {
        return Duration.between(start, end).toDays();
    }

    public boolean overlaps(DateRange other) {
        return start.isBefore(other.end()) && other.start().isBefore(end);
    }
}