package com.example.ecommerce.entity;

import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double totalAmount;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String returnReason;
    private String refundStatus;

    @ManyToOne
    @JsonIgnoreProperties("orders")   // <-- prevents loading orders list of customer
    private User customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("order")    // <-- prevents loading order back from orderItem
    private List<OrderItem> orderItems;
}