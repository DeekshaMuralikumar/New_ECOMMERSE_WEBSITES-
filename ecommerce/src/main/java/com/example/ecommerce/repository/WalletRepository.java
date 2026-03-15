package com.example.ecommerce.repository;

// package com.example.backend.repository;

import com.example.ecommerce.entity.Wallet;
import com.example.ecommerce.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    @Query("SELECT w FROM Wallet w WHERE w.user.id = :userId")
    Optional<Wallet> findWalletByUser(@Param("userId") Long userId);

   @Query("SELECT w FROM Wallet w WHERE w.user.role = :role")
Optional<Wallet> findByUserRole(@Param("role") UserRole role);


    @Query("SELECT w FROM Wallet w WHERE w.user.role = 'ADMIN'")
    Optional<Wallet> findByUserRoleAdmin();
}