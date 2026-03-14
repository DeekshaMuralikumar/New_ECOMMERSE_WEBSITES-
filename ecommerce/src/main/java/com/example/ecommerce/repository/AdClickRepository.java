package com.example.ecommerce.repository;

import com.example.ecommerce.entity.AdClick;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface AdClickRepository extends JpaRepository<AdClick, Long> {

    @Query("SELECT COUNT(a) FROM AdClick a WHERE a.product.id = :productId")
    Long countClicksByProduct(@Param("productId") Long productId);

}