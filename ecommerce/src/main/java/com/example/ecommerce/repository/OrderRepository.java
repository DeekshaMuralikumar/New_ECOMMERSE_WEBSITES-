package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o JOIN FETCH o.orderItems WHERE o.id = :orderId")
    Order fetchOrderWithItems(@Param("orderId") Long orderId);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId")
    List<Order> findOrdersByUser(@Param("userId") Long userId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems oi JOIN oi.product p WHERE p.owner.id = :sellerId")
    List<Order> findOrdersBySeller(@Param("sellerId") Long sellerId);

    @Query("SELECT o FROM Order o WHERE o.status = :status")
    List<Order> findOrdersByStatus(@Param("status") OrderStatus status);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE CAST(o.createdAt AS date) = CURRENT_DATE")
    Double getTodayRevenue();

    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    List<Order> findOrdersBetweenDates(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.updatedAt < :time")
    List<Order> findOrdersByStatusAndDeliveredBefore(@Param("status") OrderStatus status, @Param("time") LocalDateTime time);
}