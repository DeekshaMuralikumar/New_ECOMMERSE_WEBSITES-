package com.example.ecommerce.service.impl;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.enums.VerificationStatus;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public void approveSeller(Long sellerId) {
        User user = userRepository.findById(sellerId).orElseThrow();
        user.setVerificationStatus(VerificationStatus.APPROVED);
        userRepository.save(user);
    }

    @Override
    public void rejectSeller(Long sellerId) {
        User user = userRepository.findById(sellerId).orElseThrow();
        user.setVerificationStatus(VerificationStatus.REJECTED);
        userRepository.save(user);
    }

    @Override
    public void approveProduct(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow();
        product.setVerificationStatus(VerificationStatus.APPROVED);
        productRepository.save(product);
    }

    @Override
    public void rejectProduct(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow();
        product.setVerificationStatus(VerificationStatus.REJECTED);
        productRepository.save(product);
    }
}