package com.example.ecommerce.controller;

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

    @PostMapping("/{productId}")
    public ReviewResponse addReview(@PathVariable Long productId,
                                    @RequestParam Long userId,
                                    @RequestParam int rating,
                                    @RequestParam String comment) {
        return reviewService.addReview(productId, userId, rating, comment);
    }

    @GetMapping("/{productId}")
    public List<ReviewResponse> getProductReviews(@PathVariable Long productId) {
        return reviewService.getProductReviews(productId);
    }
}