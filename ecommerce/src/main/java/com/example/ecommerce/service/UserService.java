package com.example.ecommerce.service;

import com.example.ecommerce.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();

    List<UserResponse> getUsersByRole(String role);

    List<UserResponse> getPendingVerificationUsers();

    UserResponse verifyUser(Long userId, String status);

    void deleteUser(Long id);

    UserResponse updateAddress(Long userId, String address);

}