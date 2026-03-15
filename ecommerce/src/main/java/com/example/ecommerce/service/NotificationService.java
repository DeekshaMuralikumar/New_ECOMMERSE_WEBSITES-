package com.example.ecommerce.service;

// package com.example.backend.service;

// package com.example.backend.service;

import com.example.ecommerce.entity.Notification;

import java.util.List;

public interface NotificationService {

    void createNotification(Long userId, String message);

    List<Notification> getUserNotifications(Long userId);

}

