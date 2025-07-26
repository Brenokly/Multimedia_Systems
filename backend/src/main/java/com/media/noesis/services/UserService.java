package com.media.noesis.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void create(final UserRequest.Create request) {
        final User entity = new User();
        entity.setName(request.getName());
        entity.setUsername(request.getUsername());
        entity.setAvatarId(request.getAvatarId());
        entity.setRole(request.getRole());

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        entity.setPassword(hashedPassword);

        repository.save(entity);
    }

    public UserDto findById(final long id) {
        final var entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário com id " + id + " não encontrado."));
        return converter.toDto(entity);
    }

    @Transactional
    public void update(final UserRequest.Update request) {
        final User entity = repository.findById(request.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário com id " + request.getId() + " não encontrado para atualização."));

        entity.setName(request.getName());
        entity.setUsername(request.getUsername());
        entity.setAvatarId(request.getAvatarId());
        entity.setRole(request.getRole());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            entity.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        repository.save(entity);
    }

    @Transactional
    public void delete(final long id) {
        repository.deleteById(id);
    }
}
