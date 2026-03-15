package com.example.ecommerce.service.impl;

import com.example.ecommerce.dto.request.OrderItemRequest;
import com.example.ecommerce.dto.request.OrderRequest;
import com.example.ecommerce.dto.response.OrderItemResponse;
import com.example.ecommerce.dto.response.OrderResponse;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.enums.PaymentStatus;
import com.example.ecommerce.enums.ProductStatus;
import com.example.ecommerce.enums.VerificationStatus;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    Product product = productRepository.findById(i.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found: " + i.getProductId()));

    if (product.getStatus() != ProductStatus.ACTIVE) {
        throw new RuntimeException("Product " + product.getName() + " is not active");
    }
    if (product.getVerificationStatus() != VerificationStatus.APPROVED) {
        throw new RuntimeException("Product " + product.getName() + " is not approved");
    }
    if (product.getAvailableQuantity() < i.getQuantity()) {
        throw new RuntimeException("Insufficient stock for " + product.getName());
    }

            double price = product.getPrice() != null ? product.getPrice() : 0.0;
            total += price * i.getQuantity();

            items.add(OrderItem.builder()
                    .product(product)
                    .quantity(i.getQuantity())
                    .priceAtPurchase(price)
                    .build());
        }

        Order order = Order.builder()
                .customer(customer)
                .totalAmount(total)
                .status(OrderStatus.CREATED)
                .paymentStatus(PaymentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .orderItems(new ArrayList<>())
                .build();

        for (OrderItem item : items) {
            item.setOrder(order);
            order.getOrderItems().add(item);
        }

        orderRepository.save(order);
        return mapToResponse(order);
    }

    @Override
    public OrderResponse confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != OrderStatus.CREATED) {
            throw new RuntimeException("Order cannot be confirmed from current state: " + order.getStatus());
        }
        order.setStatus(OrderStatus.CONFIRMED);
        order.setUpdatedAt(LocalDateTime.now());

        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setAvailableQuantity(product.getAvailableQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        // Process commission, etc.
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse shipOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new RuntimeException("Order must be confirmed before shipping");
        }
        order.setStatus(OrderStatus.SHIPPED);
        order.setUpdatedAt(LocalDateTime.now());
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse deliverOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != OrderStatus.SHIPPED) {
            throw new RuntimeException("Order must be shipped before delivery");
        }
        order.setStatus(OrderStatus.DELIVERED);
        order.setUpdatedAt(LocalDateTime.now());
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel shipped/delivered order");
        }
        if (order.getStatus() == OrderStatus.CONFIRMED) {
            // Restore stock
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setAvailableQuantity(product.getAvailableQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }
        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse requestReturn(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Only delivered orders can be returned");
        }
        // Check 24h window
        if (order.getUpdatedAt().plusHours(24).isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Return window expired (24 hours)");
        }
        order.setStatus(OrderStatus.RETURN_REQUESTED);
        order.setReturnReason(reason);
        order.setUpdatedAt(LocalDateTime.now());
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .build();
    }

    @Override
    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.fetchOrderWithItems(orderId);
        if (order == null) throw new RuntimeException("Order not found");
        return mapToResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findOrdersByUser(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersBySeller(Long sellerId) {
        return orderRepository.findOrdersBySeller(sellerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .createdAt(order.getCreatedAt())
                .orderItems(order.getOrderItems() != null ? order.getOrderItems().stream()
                        .map(i -> OrderItemResponse.builder()
                                .productId(i.getProduct().getId())
                                .productName(i.getProduct().getName())
                                .quantity(i.getQuantity())
                                .priceAtPurchase(i.getPriceAtPurchase())
                                .productImage(i.getProduct().getImage())
                                .categoryName(i.getProduct().getCategory() != null ? i.getProduct().getCategory().getName() : "General")
                                .availableQuantity(i.getProduct().getAvailableQuantity())
                                .build())
                        .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    @Override
public OrderResponse approveReturn(Long orderId) {
    Order order = orderRepository.findById(orderId).orElseThrow();
    if (order.getStatus() != OrderStatus.RETURN_REQUESTED) {
        throw new RuntimeException("Order is not in return requested state");
    }
    order.setStatus(OrderStatus.RETURN_APPROVED);
    order.setUpdatedAt(LocalDateTime.now());
    // Optionally, restore stock? Usually after return is completed, but here we just approve.
    return mapToResponse(order);
}

@Override
public OrderResponse rejectReturn(Long orderId) {
    Order order = orderRepository.findById(orderId).orElseThrow();
    if (order.getStatus() != OrderStatus.RETURN_REQUESTED) {
        throw new RuntimeException("Order is not in return requested state");
    }
    order.setStatus(OrderStatus.DELIVERED); // or maybe a specific "RETURN_REJECTED" status? We'll keep as DELIVERED for simplicity.
    order.setUpdatedAt(LocalDateTime.now());
    return mapToResponse(order);
}

@Override
public OrderResponse processRefund(Long orderId, double amount) {
    Order order = orderRepository.findById(orderId).orElseThrow();
    if (order.getStatus() != OrderStatus.RETURN_APPROVED) {
        throw new RuntimeException("Order must be return approved before refund");
    }
    // Process refund logic (e.g., update payment status, wallet)
    order.setRefundStatus("REFUNDED");
    order.setStatus(OrderStatus.REFUNDED);
    order.setUpdatedAt(LocalDateTime.now());
    // Optionally restore stock? If product is returned, stock should be added back.
    for (OrderItem item : order.getOrderItems()) {
        Product product = item.getProduct();
        product.setAvailableQuantity(product.getAvailableQuantity() + item.getQuantity());
        productRepository.save(product);
    }
    return mapToResponse(order);
}
}