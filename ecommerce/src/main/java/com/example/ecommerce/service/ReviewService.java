package com.example.ecommerce.service;

import com.example.ecommerce.dto.response.ReviewResponse;
import java.util.List;

public interface ReviewService {
    ReviewResponse addReview(Long productId, Long userId, int rating, String comment);
    List<ReviewResponse> getProductReviews(Long productId);
}