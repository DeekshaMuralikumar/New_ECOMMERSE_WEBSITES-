package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
    @Query("SELECT a FROM Advertisement a WHERE a.product.id = :productId")
    List<Advertisement> findAdsByProduct(@Param("productId") Long productId);

    @Query("SELECT a FROM Advertisement a WHERE a.enabled = true")
    List<Advertisement> findActiveAdvertisements();
}