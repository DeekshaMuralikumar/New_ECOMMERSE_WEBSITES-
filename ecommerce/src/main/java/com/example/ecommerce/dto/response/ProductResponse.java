package com.example.ecommerce.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String image;
    private Double price;
    private int availableQuantity;
    private String category;
    private String status;
    private String verificationStatus;
    private Long ownerId;
    private boolean isAdvertised;
    private Double weight;
}