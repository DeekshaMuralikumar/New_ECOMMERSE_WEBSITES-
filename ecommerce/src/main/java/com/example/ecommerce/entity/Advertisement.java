package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "advertisements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Advertisement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private boolean enabled;
    @ManyToOne
    private Product product;
}