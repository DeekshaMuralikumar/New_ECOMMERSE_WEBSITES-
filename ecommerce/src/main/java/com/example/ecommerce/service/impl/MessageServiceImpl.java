package com.example.ecommerce.service.impl;

// package com.example.backend.service.impl;

import com.example.ecommerce.entity.Message;
import com.example.ecommerce.repository.MessageRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public Message sendMessage(Long senderId, Long receiverId, String content) {
        Message message = Message.builder()
                .sender(userRepository.findById(senderId).orElseThrow())
                .receiver(userRepository.findById(receiverId).orElseThrow())
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getConversation(Long user1, Long user2) {
        return messageRepository.findConversation(user1, user2);
    }
}