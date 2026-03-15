package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.OrderRequest;
import com.example.ecommerce.dto.response.OrderResponse;
import com.example.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

   @PostMapping("/{userId}")
    public ResponseEntity<?> createOrder(@PathVariable Long userId,
                                         @RequestBody OrderRequest request) {
        try {
            OrderResponse response = orderService.createOrder(userId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/my-orders")
    public List<OrderResponse> getMyOrders(@RequestParam Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Long id) {
        return orderService.getOrder(id);
    }

    @GetMapping("/user/{userId}")
    public List<OrderResponse> getUserOrders(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping("/seller/{sellerId}")
    public List<OrderResponse> getSellerOrders(@PathVariable Long sellerId) {
        return orderService.getOrdersBySeller(sellerId);
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

    @PostMapping("/{id}/return")
    public OrderResponse requestReturn(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderService.requestReturn(id, body.get("return_reason"));
    }

    // In OrderController
@PutMapping("/{id}/approve-return")
public OrderResponse approveReturn(@PathVariable Long id) {
    return orderService.approveReturn(id);
}

@PutMapping("/{id}/reject-return")
public OrderResponse rejectReturn(@PathVariable Long id) {
    return orderService.rejectReturn(id);
}

@PutMapping("/{id}/refund")
public OrderResponse processRefund(@PathVariable Long id, @RequestParam double amount) {
    return orderService.processRefund(id, amount);
}
}