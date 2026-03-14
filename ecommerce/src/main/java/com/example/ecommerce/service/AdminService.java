package com.example.ecommerce.service;

// package com.example.backend.service;

public interface AdminService {

    void approveSeller(Long sellerId);

    void rejectSeller(Long sellerId);

    void approveProduct(Long productId);

    void rejectProduct(Long productId);

}