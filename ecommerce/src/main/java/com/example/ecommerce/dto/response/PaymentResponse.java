package com.example.ecommerce.dto.response;

// package com.example.backend.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentResponse {
    private Long paymentId;
    private double amount;
    private String method;
    private String status;
}