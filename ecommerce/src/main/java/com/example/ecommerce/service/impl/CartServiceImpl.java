package com.example.ecommerce.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.UserRepository;

import com.example.ecommerce.service.CartService;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Product;

import com.example.ecommerce.dto.request.CartRequest;
import com.example.ecommerce.dto.response.CartResponse;
import com.example.ecommerce.dto.response.OrderItemResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

        private final CartRepository cartRepository;
        private final ProductRepository productRepository;
        private final CartItemRepository cartItemRepository;
        private final UserRepository userRepository;

        @Override
        public CartResponse addToCart(Long userId, CartRequest request) {

                Cart cart = cartRepository.findCartByUser(userId)
                                .orElseGet(() -> cartRepository.save(
                                                Cart.builder().user(userRepository.findById(userId).orElseThrow())
                                                                .build()));

                Product product = productRepository.findById(request.getProductId()).orElseThrow();

                CartItem item = CartItem.builder()
                                .cart(cart)
                                .product(product)
                                .quantity(request.getQuantity())
                                .build();

                cartItemRepository.save(item);

                return getCart(userId);
        }

        @Override
        public CartResponse getCart(Long userId) {

                Cart cart = cartRepository.findCartByUser(userId).orElseThrow();

                List<OrderItemResponse> items = cart.getItems()
                                .stream()
                                .map(i -> OrderItemResponse.builder()
                                                .productId(i.getProduct().getId())
                                                .productName(i.getProduct().getName())
                                                .quantity(i.getQuantity())
                                                .priceAtPurchase(i.getProduct().getPrice())
                                                .build())
                                .toList();

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
                return getCart(userId);
        }

        @Override
        public void clearCart(Long userId) {
                Cart cart = cartRepository.findCartByUser(userId).orElseThrow();
                cart.getItems().clear();
        }
}