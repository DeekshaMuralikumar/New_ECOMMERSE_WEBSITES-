package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.UserResponse;
import com.example.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping
    public List<UserResponse> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/role/{role}")
    public List<UserResponse> getUsersByRole(@PathVariable String role) {
        return userService.getUsersByRole(role);
    }

    @GetMapping("/pending")
    public List<UserResponse> getPendingUsers() {
        return userService.getPendingVerificationUsers();
    }

    @PutMapping("/{id}/verify")
    public UserResponse verifyUser(@PathVariable Long id, @RequestParam String status) {
        return userService.verifyUser(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}/address")
    public UserResponse updateAddress(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return userService.updateAddress(id, body.get("address"));
    }
}