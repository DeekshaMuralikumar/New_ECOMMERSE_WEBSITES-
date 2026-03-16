package com.example.ecommerce.service;
// package com.example.backend.service;

// package com.example.backend.service;

import java.util.*;


import com.example.ecommerce.dto.request.PaymentRequest;
import com.example.ecommerce.dto.response.PaymentResponse;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest request);

    PaymentResponse verifyCODPayment(Long orderId);

    Map<String, String> createPaymentIntent(Double amount);
}
