package com.example.rentalcars.features.user.infrastructure;

import com.example.rentalcars.features.user.domain.User;
import com.example.rentalcars.features.user.domain.UserRepository;
import com.example.rentalcars.features.user.infrastructure.mapper.UserMapper;
import com.example.rentalcars.features.user.infrastructure.persistence.CustomerProfileEntity;
import com.example.rentalcars.features.user.infrastructure.persistence.UserJpaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserJpaRepository jpaRepository;
    private final UserMapper userMapper;

    @Override
    public User save(User user) {
        var entity = userMapper.toEntity(user);

        if (entity.getProfile() == null) {
            var profileEntity = new CustomerProfileEntity();
            profileEntity.setId(UUID.randomUUID());
            profileEntity.setUser(entity);
            entity.setProfile(profileEntity);
        }

        var saved = jpaRepository.save(entity);
        return userMapper.toDomain(saved);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(userMapper::toDomain);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return jpaRepository.findById(id).map(userMapper::toDomain);
    }
}
