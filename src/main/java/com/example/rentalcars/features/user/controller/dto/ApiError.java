package com.example.rentalcars.features.user.controller.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ApiError {
    private int status;
    private String message;
    private String errorCode;
    private LocalDateTime timestamp;
}