package com.example.rentalcars.features.payment.domain.model;

import com.example.rentalcars.core.valueobject.Money;
import lombok.*;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class Payment {
    private UUID id;
    private UUID reservationId;
    private Money amount;
    private String stripePaymentId;
    private PaymentStatus status;
}
