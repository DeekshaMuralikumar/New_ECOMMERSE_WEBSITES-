package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.CartRequest;
import com.example.ecommerce.dto.response.CartResponse;
import com.example.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public CartResponse getCart(@PathVariable Long userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/{userId}")
    public CartResponse addToCart(@PathVariable Long userId,
                                  @RequestBody CartRequest request) {
        return cartService.addToCart(userId, request);
    }

    @DeleteMapping("/{userId}/{productId}")
    public CartResponse removeItem(@PathVariable Long userId,
                                   @PathVariable Long productId) {
        return cartService.removeFromCart(userId, productId);
    }

    @PutMapping("/{userId}/{productId}")
    public CartResponse updateQuantity(@PathVariable Long userId,
                                       @PathVariable Long productId,
                                       @RequestParam int quantity) {
        return cartService.updateQuantity(userId, productId, quantity);
    }

    @DeleteMapping("/clear/{userId}")
    public void clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
    }
}