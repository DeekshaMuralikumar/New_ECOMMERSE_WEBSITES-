package com.example.ecommerce.entity;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.example.ecommerce.entity.User;

@Entity
@Table(name = "ad_clicks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdClick {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;

    @ManyToOne
    private Product product;

    @ManyToOne
    private User user;
}