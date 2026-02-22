package com.example.rentalcars.features.reservation.domain.model;

import com.example.rentalcars.features.reservation.domain.exception.InvalidReservationDatesException;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Reservation {
    private UUID id;
    private UUID userId;
    private UUID vehicleId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal totalAmount;
    private ReservationStatus status;

    public long getDurationInDays() {
        if (startDate == null || endDate == null) return 0;
        return ChronoUnit.DAYS.between(startDate.toLocalDate(), endDate.toLocalDate());
    }

    public boolean isValid() {
        return startDate != null && endDate != null && endDate.isAfter(startDate);
    }

    public void cancel() {
        this.status = ReservationStatus.CANCELLED;
    }

    public void calculateTotal(BigDecimal dailyPrice) {
        if (!isValid()) {
            throw new InvalidReservationDatesException();
        }

        long days = ChronoUnit.DAYS.between(startDate, endDate);
        if (days <= 0) days = 1;  // At least 1 day
        this.totalAmount = dailyPrice.multiply(BigDecimal.valueOf(days));
    }
}