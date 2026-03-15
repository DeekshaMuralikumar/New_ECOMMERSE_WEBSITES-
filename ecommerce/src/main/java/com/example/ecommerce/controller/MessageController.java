package com.example.ecommerce.controller;

// package com.example.backend.controller;

import com.example.ecommerce.entity.Message;
import com.example.ecommerce.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public Message sendMessage(@RequestParam Long senderId,
                               @RequestParam Long receiverId,
                               @RequestParam String content) {
        return messageService.sendMessage(senderId, receiverId, content);
    }

    @GetMapping
    public List<Message> getConversation(@RequestParam Long user1,
                                         @RequestParam Long user2) {
        return messageService.getConversation(user1, user2);
    }
}
