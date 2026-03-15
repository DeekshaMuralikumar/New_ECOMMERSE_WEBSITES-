package com.example.ecommerce.dto.request;

// import org.antlr.v4.runtime.misc.NotNull;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartRequest {

    @NotNull
    private Long productId;

    @NotNull
    private Integer quantity;
}