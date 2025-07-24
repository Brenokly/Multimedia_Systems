package com.media.noesis.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.media.noesis.converters.UserConverter;
import com.media.noesis.dto.UserDto;
import com.media.noesis.dto.UserRequest;
import com.media.noesis.repositories.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

    private UserRepository repository;
    private UserConverter converter;

    public List<UserDto> listAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    public void create(final UserRequest.Create request) {
        final var entity = converter.toEntity(request);
        repository.save(entity);
    }

    public UserDto findById(final long id) {
        final var entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException());
        return converter.toDto(entity);
    }

    public void update(final UserRequest.Update request) {
        final var entity = converter.toEntity(request);
        repository.save(entity);
    }

    public void delete(final long id) {
        repository.deleteById(id);
    }

}
