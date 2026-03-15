package com.example.ecommerce.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderItemResponse {
    private Long productId;
    private String productName;
    private int quantity;
    private double priceAtPurchase;
    private String productImage;
    private String categoryName;
    private int availableQuantity;
}