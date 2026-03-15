package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ad_clicks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdClick {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime timestamp;
    @ManyToOne
    private Product product;
    @ManyToOne
    private User user;
}