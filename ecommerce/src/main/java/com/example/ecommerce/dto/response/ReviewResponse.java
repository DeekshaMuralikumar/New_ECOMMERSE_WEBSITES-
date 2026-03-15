package com.example.ecommerce.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private int rating;
    private String comment;
    private String userName;
    private LocalDateTime createdAt;
}