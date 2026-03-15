package com.example.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank
    private String name;

    private String description;

    private String image;

    @NotNull
    private Double price;

    @NotNull
    private Integer availableQuantity;

    private Double weight;

    private Long categoryId;

    private Integer minThreshold;
}