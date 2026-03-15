package com.example.ecommerce.service;

// package com.example.backend.service;

// package com.example.backend.service;

import com.example.ecommerce.entity.Message;

import java.util.List;

public interface MessageService {

    Message sendMessage(Long senderId, Long receiverId, String content);

    List<Message> getConversation(Long user1, Long user2);

}