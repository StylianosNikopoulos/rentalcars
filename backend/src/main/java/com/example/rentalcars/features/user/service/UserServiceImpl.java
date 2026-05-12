package com.example.rentalcars.features.user.service;

import com.example.rentalcars.core.exception.BusinessException;
import com.example.rentalcars.features.reservation.domain.port.inbound.ReservationService;
import com.example.rentalcars.features.user.domain.model.CustomerProfile;
import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UpdateUserRequest;
import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserRequest;
import com.example.rentalcars.features.user.domain.model.Role;
import com.example.rentalcars.features.user.domain.model.User;
import com.example.rentalcars.features.user.domain.port.outbound.UserRepository;
import com.example.rentalcars.features.user.domain.exception.UserNotFoundException;
import com.example.rentalcars.features.user.domain.port.inbound.UserService;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReservationService reservationService;

    private static final String DELETED_USER_FIRST_NAME = "Deleted";
    private static final String DELETED_USER_LAST_NAME = "User";
    private static final String DELETED_USER_EMAIL_SUFFIX = "@system.local";
    private static final String DELETED_USER_EMAIL_PREFIX = "deleted_";
    private static final String DELETED_USER_PASSWORD_PREFIX = "DELETED_";

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Lazy ReservationService reservationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.reservationService = reservationService;
    }

    @Override
    public User getUserById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        validateOwnership(user);
        return user;
    }

    @Override
    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
        validateOwnership(user);
        return user;
    }

    @Override
    public User getInternalUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
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

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    @Transactional
    public User update(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().matches("^[26]\\d{9}$")) {
            throw new BusinessException("Invalid phone number", "INVALID_PHONE");
        }

        validateOwnership(user);

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        CustomerProfile profile = user.getProfile();

        if (profile == null) {
            profile = CustomerProfile.builder()
                    .id(UUID.randomUUID())
                    .phoneNumber(request.getPhoneNumber())
                    .address(request.getAddress())
                    .driverLicenseNumber(request.getDriverLicenseNumber() != null ? request.getDriverLicenseNumber().name() : null)
                    .build();
            user.setProfile(profile);
        } else {
            profile.setAddress(request.getAddress());
            profile.setPhoneNumber(request.getPhoneNumber());
            profile.setDriverLicenseNumber(request.getDriverLicenseNumber() != null ? request.getDriverLicenseNumber().name() : null);
        }

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        validateOwnership(user);
        reservationService.cancelAllActiveReservationsByUserId(id);

        user.setFirstName(DELETED_USER_FIRST_NAME);
        user.setLastName(DELETED_USER_LAST_NAME);
        user.setEmail(DELETED_USER_EMAIL_PREFIX + id + DELETED_USER_EMAIL_SUFFIX);
        user.setPasswordHash(DELETED_USER_PASSWORD_PREFIX + UUID.randomUUID());

        if (user.getProfile() != null) {
            CustomerProfile profile = user.getProfile();
            profile.setPhoneNumber(null);
            profile.setAddress(null);
            profile.setDriverLicenseNumber(null);
        }

        userRepository.save(user);
    }
    // Helper method for security
    private void validateOwnership(User user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(auth)) {
            return;
        }

        if (!user.getEmail().equals(auth.getName())) {
            throw new AccessDeniedException("You do not have permission to access this user's data");
        }
    }

    // Helper method for admin check
    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
