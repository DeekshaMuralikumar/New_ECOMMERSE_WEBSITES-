package com.example.ecommerce.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderRequest {
    @NotEmpty
    private List<OrderItemRequest> items;
    private Long addressId;   // optional
    private String paymentMethod; // "COD" or "STRIPE"
}