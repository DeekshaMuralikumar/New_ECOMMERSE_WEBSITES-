package com.example.ecommerce.service.impl;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.ecommerce.repository.ReviewRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.ReviewService;

import java.util.List;

import com.example.ecommerce.dto.request.ReviewRequest;
import com.example.ecommerce.dto.response.ReviewResponse;
import com.example.ecommerce.entity.Review;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

        private final ReviewRepository reviewRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;

        @Override
        public ReviewResponse addReview(Long userId, ReviewRequest request) {

                Review review = Review.builder()
                                .product(productRepository.findById(request.getProductId()).orElseThrow())
                                .user(userRepository.findById(userId).orElseThrow())
                                .rating(request.getRating())
                                .comment(request.getComment())
                                .build();

                reviewRepository.save(review);

                return ReviewResponse.builder()
                                .id(review.getId())
                                .rating(review.getRating())
                                .comment(review.getComment())
                                .build();
        }

        @Override
        public List<ReviewResponse> getReviewsByProduct(Long productId) {

                return reviewRepository.findReviewsByProduct(productId)
                                .stream()
                                .map(r -> ReviewResponse.builder()
                                                .id(r.getId())
                                                .rating(r.getRating())
                                                .comment(r.getComment())
                                                .build())
                                .toList();
        }
}