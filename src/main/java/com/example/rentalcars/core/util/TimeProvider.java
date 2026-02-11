package com.example.rentalcars.core.util;

import java.time.Instant;

public interface TimeProvider {
    Instant now();
}