package com.example.rentalcars.features.user.service;

import com.example.rentalcars.core.exception.BusinessException;
import com.example.rentalcars.features.user.domain.model.CustomerProfile;
import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserRequest;
import com.example.rentalcars.features.user.domain.model.Role;
import com.example.rentalcars.features.user.domain.model.User;
import com.example.rentalcars.features.user.domain.port.outbound.UserRepository;
import com.example.rentalcars.features.user.domain.exception.UserNotFoundException;
import com.example.rentalcars.features.user.domain.port.inbound.UserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User getUserById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
    }

    @Override
    @Transactional
    public User register(UserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessException("Email already exists", "EMAIL_TAKEN");
        }

        var profile = CustomerProfile.builder()
                .id(UUID.randomUUID())
                .phoneNumber(null)
                .address(null)
                .driverLicenseNumber(null)
                .build();

        var user = User.builder()
                .id(UUID.randomUUID())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.CUSTOMER)
                .profile(profile)
                .build();

        return userRepository.save(user);
    }
}
