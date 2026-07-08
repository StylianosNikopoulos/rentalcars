package com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest;

import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UpdateUserRequest;
import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserResponse;
import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.mapper.UserMapper;
import com.example.rentalcars.features.user.domain.port.inbound.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(@PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        var users = userService.getAllUsers(pageable).map(userMapper::toResponse);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id, @Valid @RequestBody UpdateUserRequest request) {
        var updatedUser = userService.update(id, request);
        return ResponseEntity.ok(userMapper.toResponse(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
