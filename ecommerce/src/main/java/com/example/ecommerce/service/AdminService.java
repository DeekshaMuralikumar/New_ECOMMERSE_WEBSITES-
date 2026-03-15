package com.example.ecommerce.service;
public interface AdminService {

    void approveSeller(Long sellerId);

    void rejectSeller(Long sellerId);

    void approveProduct(Long productId);

    void rejectProduct(Long productId);

}