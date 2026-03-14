package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Advertisement;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {

    @Query("SELECT a FROM Advertisement a WHERE a.product.id = :productId")
    List<Advertisement> findAdsByProduct(@Param("productId") Long productId);

}