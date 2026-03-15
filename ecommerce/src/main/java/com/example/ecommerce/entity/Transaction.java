package com.example.ecommerce.entity;

// package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double amount;
    private String type; // CREDIT/DEBIT
    private LocalDateTime createdAt;
    @ManyToOne
    private Wallet wallet;
}
