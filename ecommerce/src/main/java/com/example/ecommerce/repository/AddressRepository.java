package com.example.ecommerce.repository;

import com.example.ecommerce.model.Address;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    @Query("SELECT a FROM Address a WHERE a.user.id = :userId")
    List<Address> findAddressesByUser(@Param("userId") Long userId);

}