package com.example.rentalcars.features.reservation.domain.model;

import com.example.rentalcars.core.valueobject.DateRange;
import com.example.rentalcars.core.valueobject.Money;
import lombok.*;
import java.math.BigDecimal;
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
    private DateRange period;
    private Money totalAmount;
    private ReservationStatus status;

    public void cancel() {
        this.status = ReservationStatus.CANCELLED;
    }

    public void calculateTotal(Money dailyPrice) {

        long days = period.toDays();
        if (days <= 0) days = 1;  // At least 1 day
        BigDecimal totalValue = dailyPrice.amount().multiply(BigDecimal.valueOf(days));
        this.totalAmount = new Money(totalValue, dailyPrice.currency());
    }
}