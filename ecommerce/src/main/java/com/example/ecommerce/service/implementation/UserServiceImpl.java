package com.example.ecommerce.service.implementation;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.UserService;

import java.util.List;

import com.example.ecommerce.dto.response.UserResponse;
import com.example.ecommerce.model.User;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id).orElseThrow();

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .verificationStatus(user.getVerificationStatus().name())
                .build();
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .verificationStatus(user.getVerificationStatus().name())
                        .build())
                .toList();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<UserResponse> getPendingSellers() {
        return userRepository.findUsersByVerificationStatus(com.example.ecommerce.model.enums.VerificationStatus.PENDING)
                .stream()
                .filter(u -> u.getRole() == com.example.ecommerce.model.enums.UserRole.SELLER || u.getRole() == com.example.ecommerce.model.enums.UserRole.FBA_MERCHANT)
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .verificationStatus(user.getVerificationStatus().name())
                        .build())
                .toList();
    }
}