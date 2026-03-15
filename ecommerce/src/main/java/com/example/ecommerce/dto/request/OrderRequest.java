package com.example.ecommerce.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {

    @NotEmpty
    private List<OrderItemRequest> items;

    private Long addressId;

    private String paymentMethod;
}