package com.example.ecommerce.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;

import com.example.ecommerce.service.CartService;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Product;

import com.example.ecommerce.dto.request.CartRequest;
import com.example.ecommerce.dto.response.CartResponse;
import com.example.ecommerce.dto.response.OrderItemResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartResponse addToCart(Long userId, CartRequest request) {
        Cart cart = cartRepository.findCartByUser(userId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(userRepository.findById(userId).orElseThrow())
                                .items(new ArrayList<>())
                                .build()));

        Product product = productRepository.findById(request.getProductId()).orElseThrow();

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .price(product.getPrice())
                    .build();
            cart.getItems().add(newItem);
        }

        cartRepository.save(cart);
        return getCart(userId);
    }

    @Override
    public CartResponse getCart(Long userId) {
        Cart cart = cartRepository.findCartByUser(userId).orElse(null);
        if (cart == null) {
            return CartResponse.builder()
                    .items(new ArrayList<>())
                    .totalPrice(0.0)
                    .build();
        }

        List<OrderItemResponse> items = cart.getItems().stream()
                .map(i -> {
                    Product p = i.getProduct();
                    return OrderItemResponse.builder()
                            .productId(p.getId())
                            .productName(p.getName())
                            .quantity(i.getQuantity())
                            .priceAtPurchase(i.getPrice())   // FIXED: removed null check
                            .productImage(p.getImage())
                            .categoryName(p.getCategory() != null ? p.getCategory().getName() : "General")
                            .availableQuantity(p.getAvailableQuantity())
                            .build();
                })
                .collect(Collectors.toList());

        double total = items.stream()
                .mapToDouble(i -> i.getPriceAtPurchase() * i.getQuantity())
                .sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalPrice(total)
                .build();
    }

    @Override
    public CartResponse removeFromCart(Long userId, Long productId) {
        Cart cart = cartRepository.findCartByUser(userId).orElseThrow();
        cart.getItems().removeIf(i -> i.getProduct().getId().equals(productId));
        cartRepository.save(cart);
        return getCart(userId);
    }

    @Override
    public CartResponse updateQuantity(Long userId, Long productId, int quantity) {
        Cart cart = cartRepository.findCartByUser(userId).orElseThrow();
        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    if (quantity <= 0) {
                        cart.getItems().remove(item);
                    } else {
                        item.setQuantity(quantity);
                    }
                });
        cartRepository.save(cart);
        return getCart(userId);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findCartByUser(userId).orElseThrow();
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}