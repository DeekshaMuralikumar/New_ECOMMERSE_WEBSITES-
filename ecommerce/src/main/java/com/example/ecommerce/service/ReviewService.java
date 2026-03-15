package com.example.ecommerce.service;

// package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.ReviewRequest;
import com.example.ecommerce.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse addReview(Long userId, ReviewRequest request);

    List<ReviewResponse> getReviewsByProduct(Long productId);

}