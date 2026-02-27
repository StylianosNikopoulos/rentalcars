package com.example.rentalcars.features.payment.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.payment.domain.model.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class PaymentJpaEntity {
    @Id
    private UUID id;

    @Column(nullable = false)
    private UUID reservationId;

    @Column(unique = true)
    private String stripePaymentId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private String receiptUrl;

    private LocalDateTime createdAt;
}