package com.example.rentalcars.features.user.controller;

import com.example.rentalcars.features.user.controller.dto.LoginRequest;
import com.example.rentalcars.features.user.controller.dto.UserRequest;
import com.example.rentalcars.features.user.controller.dto.UserResponse;
import com.example.rentalcars.features.user.infrastructure.mapper.UserMapper;
import com.example.rentalcars.features.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        var user = userService.getUserById(id);
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        var user = userService.getUserByEmail(email);
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRequest request){
        var savedUser = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toResponse(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        var user = userService.login(request);
        return ResponseEntity.ok(userMapper.toResponse(user));
    }
}
