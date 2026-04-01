package com.example.rentalcars.core.valueobject;

import com.example.rentalcars.core.exception.BusinessException;

import java.time.LocalDate;
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

    public boolean isPast() {
        return start.toLocalDate().isBefore(LocalDate.now());
    }
}