package com.example.rentalcars.core.valueobject;

import java.math.BigDecimal;
import java.math.RoundingMode;

public record Money(BigDecimal amount, String currency) {
    public Money {
        if (amount == null) throw new IllegalArgumentException("Amount cannot be null");
        amount = amount.setScale(2, RoundingMode.HALF_UP);
    }

    public static Money usd(BigDecimal amount) {
        return new Money(amount, "USD");
    }
}