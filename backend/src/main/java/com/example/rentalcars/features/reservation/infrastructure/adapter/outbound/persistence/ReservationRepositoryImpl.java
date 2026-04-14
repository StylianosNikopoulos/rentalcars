package com.example.rentalcars.features.reservation.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.core.valueobject.DateRange;
import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.model.ReservationStatus;
import com.example.rentalcars.features.reservation.domain.port.outbound.ReservationRepository;
import com.example.rentalcars.features.user.infrastructure.adapter.outbound.persistence.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ReservationRepositoryImpl implements ReservationRepository {

    private final ReservationJpaRepository jpaRepository;
    private final ReservationPersistenceMapper mapper;
    private final UserJpaRepository userJpaRepository;

    @Override
    public Reservation save(Reservation reservation) {
        var entity = mapper.toEntity(reservation);
        if (reservation.getUserId() != null) {
            entity.setUser(userJpaRepository.getReferenceById(reservation.getUserId()));
        }
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Reservation> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Reservation> findByUserId(UUID userId) {
        return jpaRepository.findByUserId(userId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Reservation> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Reservation> findByVehicleId(UUID vehicleId) {
        return jpaRepository.findByVehicleId(vehicleId).stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public boolean existsOverlap(UUID vehicleId, DateRange period) {
        return jpaRepository.existsOverlappingReservations(vehicleId, period.start(), period.end());
    }

    @Override
    public List<Reservation> findAllByUserIdAndStatusIn(UUID userId, List<ReservationStatus> statuses) {
        return jpaRepository.findAllByUserIdAndStatusIn(userId, statuses)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Reservation> findAllExpiredPending(LocalDateTime threshold) {
        return jpaRepository.findAllByStatusAndCreatedAtBefore(ReservationStatus.PENDING, threshold)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
