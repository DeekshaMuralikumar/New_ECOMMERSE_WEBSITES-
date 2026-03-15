package com.example.ecommerce.util;

// package com.example.backend.util;

import java.time.LocalDateTime;

public class DateUtil {

    public static boolean isReturnAllowed(LocalDateTime deliveredTime) {

        return deliveredTime.plusHours(24)
                .isAfter(LocalDateTime.now());
    }

    public static boolean isExpired(LocalDateTime time, int hours) {

        return time.plusHours(hours)
                .isBefore(LocalDateTime.now());
    }
}