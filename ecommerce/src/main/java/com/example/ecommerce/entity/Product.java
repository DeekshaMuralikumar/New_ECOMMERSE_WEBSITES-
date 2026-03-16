package com.example.ecommerce.entity;

import com.example.ecommerce.enums.ProductStatus;
import com.example.ecommerce.enums.VerificationStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Product name is required")
    private String name;

    @Column(length = 2000)
    private String description;

    private String image;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private Double price;

    @NotNull(message = "Available quantity is required")
    @PositiveOrZero(message = "Available quantity cannot be negative")
    private int availableQuantity;

    @NotNull(message = "Weight is required for FBA products")
    @Positive(message = "Weight must be greater than 0")
    private double weight;

    @NotNull(message = "Minimum threshold is required")
    @Positive(message = "Minimum threshold must be greater than 0")
    private int minThreshold;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;

    private LocalDateTime createdAt;

    @ManyToOne
    @JsonIgnoreProperties("products")
    private Category category;

    @ManyToOne
    @JsonIgnoreProperties({"products", "orders", "password"})
    private User owner;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<Review> reviews;
}