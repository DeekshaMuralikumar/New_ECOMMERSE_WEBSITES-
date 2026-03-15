package com.example.ecommerce.dto.request;
// package com.example.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentRequest {
    @NotNull
    private Long orderId;
    @NotNull
    private String method; // "COD" or "STRIPE"
}
