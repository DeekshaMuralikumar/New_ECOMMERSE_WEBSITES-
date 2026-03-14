package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private String image;

    private double price;

    private int availableQuantity;

    private String category;

    private String owner;

    private String status;
}