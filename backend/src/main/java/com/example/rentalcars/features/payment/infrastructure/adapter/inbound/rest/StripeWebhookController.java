package com.example.rentalcars.features.payment.infrastructure.adapter.inbound.rest;

import com.example.rentalcars.features.payment.domain.port.inbound.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/v1/payments/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error");
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().get();
            paymentService.processSuccessfulPayment(intent.getId());
        } else if ("payment_intent.payment_failed".equals(event.getType())){
            PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().get();
            paymentService.processFailedPayment(intent.getId());

            String errorMessage = intent.getLastPaymentError() != null ? intent.getLastPaymentError().getMessage() : "Unknown error";
            System.out.println("Payment failed for intent " + intent.getId() + ": " + errorMessage);
        }

        return ResponseEntity.ok().build();
    }
}