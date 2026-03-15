package com.example.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantity;
    private double priceAtPurchase;

    @ManyToOne
    @JsonIgnoreProperties("orderItems")   // <-- prevents loading orderItems list
    private Order order;

    @ManyToOne
    @JsonIgnoreProperties({"orderItems", "reviews", "owner"}) // adjust
    private Product product;
}