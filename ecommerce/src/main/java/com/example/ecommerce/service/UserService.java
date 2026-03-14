package com.example.ecommerce.service;

import com.example.ecommerce.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();

    void deleteUser(Long id);

    List<UserResponse> getPendingSellers();

}