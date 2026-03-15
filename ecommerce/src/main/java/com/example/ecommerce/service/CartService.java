package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.CartRequest;
import com.example.ecommerce.dto.response.CartResponse;

public interface CartService {

    CartResponse getCart(Long userId);

    CartResponse addToCart(Long userId, CartRequest request);

    CartResponse removeFromCart(Long userId, Long productId);

    CartResponse updateQuantity(Long userId, Long productId, int quantity);

    void clearCart(Long userId);

}