package com.example.ecommerce.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewRequest {
    @NotNull
    private Long productId;
    @Min(1) @Max(5)
    private int rating;
    private String comment;
}