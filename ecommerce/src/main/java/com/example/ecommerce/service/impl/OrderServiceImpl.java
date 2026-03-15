package com.example.ecommerce.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;

import com.example.ecommerce.service.OrderService;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;

import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.enums.PaymentStatus;

import com.example.ecommerce.dto.request.OrderRequest;
import com.example.ecommerce.dto.request.OrderItemRequest;
import com.example.ecommerce.dto.response.OrderResponse;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public OrderResponse createOrder(Long userId, OrderRequest request) {

        User customer = userRepository.findById(userId).orElseThrow();

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest i : request.getItems()) {

            Product product = productRepository.findById(i.getProductId()).orElseThrow();

            if (product.getAvailableQuantity() < i.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }

            total += product.getPrice() * i.getQuantity();

            items.add(OrderItem.builder()
                    .product(product)
                    .quantity(i.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build());
        }

        Order order = Order.builder()
                .customer(customer)
                .totalAmount(total)
                .status(OrderStatus.CREATED)
                .paymentStatus(PaymentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        orderRepository.save(order);

        items.forEach(i -> i.setOrder(order));

        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse confirmOrder(Long orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow();

        if (!order.getStatus().equals(OrderStatus.CREATED)) {
            throw new RuntimeException("Invalid state");
        }

        order.setStatus(OrderStatus.CONFIRMED);

        for (OrderItem item : order.getOrderItems()) {

            Product product = item.getProduct();
            product.setAvailableQuantity(
                    product.getAvailableQuantity() - item.getQuantity());

            productRepository.save(product);
        }

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse shipOrder(Long orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.SHIPPED);

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse deliverOrder(Long orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.DELIVERED);

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow();

        if (order.getStatus() == OrderStatus.SHIPPED) {
            throw new RuntimeException("Cannot cancel shipped order");
        }

        order.setStatus(OrderStatus.CANCELLED);

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse requestReturn(Long orderId, String reason) {

        Order order = orderRepository.findById(orderId).orElseThrow();

        order.setStatus(OrderStatus.RETURN_REQUESTED);
        order.setReturnReason(reason);

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse getOrder(Long orderId) {
        throw new RuntimeException("Implement");
    }

    @Override
    public List<OrderResponse> getOrdersByUser(Long userId) {
        throw new RuntimeException("Implement");
    }
}
