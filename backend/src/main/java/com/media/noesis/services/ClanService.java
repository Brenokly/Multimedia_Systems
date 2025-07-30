package com.media.noesis.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.media.noesis.converters.ClanConverter;
import com.media.noesis.dto.ClanDto;
import com.media.noesis.dto.ClanRequest;
import com.media.noesis.entities.User;
import com.media.noesis.enums.Role;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.repositories.ClanRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ClanService {

    private final ClanRepository repository;
    private final ClanConverter converter;

    public List<ClanDto> findAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    public void create(final ClanRequest request, final User owner) {
        if (Role.TEACHER.equals(owner.getRole())) {
            final var entity = converter.toEntity(request)
                    .setOwner(owner);

            repository.save(entity);
        } else {
            throw new UnauthorizedException("Apenas mestres podem criar clãs.");
        }
    }

    public ClanDto findById(final long id) {
        return repository.findById(id)
                .map(converter::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Clã não localizado!"));
    }

    public void update(final long id, final ClanRequest request) {
        final var entity = repository.findById(id)
                .map(original -> converter.toEntity(request, original))
                .orElseThrow(() -> new EntityNotFoundException("Clã não localizado!"));

        repository.save(entity);
    }

    public void delete(final long id) {
        repository.deleteById(id);
    }

}
