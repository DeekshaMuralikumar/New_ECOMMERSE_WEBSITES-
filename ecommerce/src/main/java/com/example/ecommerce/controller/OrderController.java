package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.OrderRequest;
import com.example.ecommerce.dto.response.OrderResponse;
import com.example.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/{userId}")
    public OrderResponse createOrder(@PathVariable Long userId,
                                     @RequestBody OrderRequest request) {
        return orderService.createOrder(userId, request);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Long id) {
        return orderService.getOrder(id);
    }

    @GetMapping("/user/{userId}")
    public List<OrderResponse> getUserOrders(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @PutMapping("/{id}/confirm")
    public OrderResponse confirm(@PathVariable Long id) {
        return orderService.confirmOrder(id);
    }

    @PutMapping("/{id}/ship")
    public OrderResponse ship(@PathVariable Long id) {
        return orderService.shipOrder(id);
    }

    @PutMapping("/{id}/deliver")
    public OrderResponse deliver(@PathVariable Long id) {
        return orderService.deliverOrder(id);
    }

    @PutMapping("/{id}/cancel")
    public OrderResponse cancel(@PathVariable Long id) {
        return orderService.cancelOrder(id);
    }
}