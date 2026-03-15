package com.example.ecommerce.dto.response;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CartResponse {
    private Long cartId;
    private List<OrderItemResponse> items;
    private double totalPrice;
}