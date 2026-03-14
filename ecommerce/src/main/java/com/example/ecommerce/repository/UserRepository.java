package com.example.ecommerce.repository;

import com.example.ecommerce.model.User;
import com.example.ecommerce.model.enums.UserRole;
import com.example.ecommerce.model.enums.VerificationStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findUsersByRole(@Param("role") UserRole role);

    @Query("SELECT u FROM User u WHERE u.verificationStatus = :status")
    List<User> findUsersByVerificationStatus(@Param("status") VerificationStatus status);

}