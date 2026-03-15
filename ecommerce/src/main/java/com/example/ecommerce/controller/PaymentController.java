package com.example.ecommerce.controller;

// package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.PaymentRequest;
import com.example.ecommerce.dto.response.PaymentResponse;
import com.example.ecommerce.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public PaymentResponse createPayment(@RequestBody PaymentRequest request) {
        return paymentService.createPayment(request);
    }

    @PutMapping("/cod/{orderId}")
    public PaymentResponse verifyCOD(@PathVariable Long orderId) {
        return paymentService.verifyCODPayment(orderId);
    }
}