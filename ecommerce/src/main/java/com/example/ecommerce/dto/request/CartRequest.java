package com.example.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CartRequest {
    @NotNull
    private Long productId;
    @NotNull
    private Integer quantity;
}