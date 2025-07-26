package com.media.noesis.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.media.noesis.converters.UserConverter;
import com.media.noesis.dto.UserDto;
import com.media.noesis.dto.UserRequest;
import com.media.noesis.entities.User;
import com.media.noesis.repositories.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserConverter converter;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> findAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    public void create(final UserRequest.Create request) {
        // Converte o DTO para a entidade
        final User entity = converter.toEntity(request);

        // ** CRIPTOGRAFA A SENHA ANTES DE SALVAR **
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        entity.setPassword(hashedPassword);

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
