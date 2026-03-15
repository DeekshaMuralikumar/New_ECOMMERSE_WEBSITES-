package com.example.ecommerce.dto.request;

// import jakarta.Validation.constraints.Max;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {

    @NotNull
    private Long productId;

    @Min(1)
    @Max(5)
    private int rating;

    private String comment;
}