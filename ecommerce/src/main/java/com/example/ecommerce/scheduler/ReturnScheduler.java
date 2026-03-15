package com.example.ecommerce.scheduler;
// package com.example.backend.scheduler;

import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ReturnScheduler {

    private final OrderRepository orderRepository;

    @Scheduled(cron = "0 0 0 * * ?") // daily at midnight
    public void disableExpiredReturns() {
        LocalDateTime deadline = LocalDateTime.now().minusHours(24);
        // You can mark orders as return-expired, but frontend already checks.
    }
}