package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.ReviewRequest;
import com.example.ecommerce.dto.response.ReviewResponse;
import com.example.ecommerce.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{userId}")
    public ReviewResponse addReview(@PathVariable Long userId,
                                    @RequestBody ReviewRequest request) {
        return reviewService.addReview(userId, request);
    }

    @GetMapping("/product/{productId}")
    public List<ReviewResponse> getReviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }
}