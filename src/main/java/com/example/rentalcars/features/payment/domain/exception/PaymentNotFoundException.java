package com.example.rentalcars.features.payment.domain.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PaymentNotFoundException extends RuntimeException {
    public PaymentNotFoundException(String message) {
        super(message);
    }

  public static PaymentNotFoundException forStripeId(String stripeId) {
    return new PaymentNotFoundException("Payment record not found for Stripe ID: " + stripeId);
  }
}
