package com.example.ecommerce.service;
// package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.OrderRequest;
import com.example.ecommerce.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(Long userId, OrderRequest request);

    OrderResponse getOrder(Long orderId);

    List<OrderResponse> getOrdersByUser(Long userId);

    OrderResponse confirmOrder(Long orderId);

    OrderResponse shipOrder(Long orderId);

    
    // ... existing methods ...
    List<OrderResponse> getOrdersBySeller(Long sellerId);


    OrderResponse deliverOrder(Long orderId);

    OrderResponse cancelOrder(Long orderId);

    OrderResponse requestReturn(Long orderId, String reason);

    List<OrderResponse> getAllOrders();

    OrderResponse approveReturn(Long orderId);
OrderResponse rejectReturn(Long orderId);
OrderResponse processRefund(Long orderId, double amount);

}
