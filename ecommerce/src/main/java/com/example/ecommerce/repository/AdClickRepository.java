package com.example.ecommerce.repository;

import com.example.ecommerce.entity.AdClick;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AdClickRepository extends JpaRepository<AdClick, Long> {
    @Query("SELECT COUNT(c) FROM AdClick c WHERE c.product.id = :productId")
    long countClicksByProduct(@Param("productId") Long productId);
}