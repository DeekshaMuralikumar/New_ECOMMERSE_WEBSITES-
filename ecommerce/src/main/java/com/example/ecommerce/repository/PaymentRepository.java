package com.example.ecommerce.repository;




import com.example.ecommerce.entity.Product;
import com.example.ecommerce.enums.ProductStatus;
import com.example.ecommerce.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.verificationStatus = 'APPROVED'")
    List<Product> findActiveApprovedProducts();

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    List<Product> findProductsByCategory(@Param("categoryId") Long categoryId);

    @Query("SELECT p FROM Product p WHERE p.availableQuantity < p.minThreshold")
    List<Product> findLowStockProducts();

    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId")
    Integer getTotalSoldByProduct(@Param("productId") Long productId);
}
