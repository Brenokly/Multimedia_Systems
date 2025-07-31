package com.media.noesis.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.media.noesis.converters.ClanConverter;
import com.media.noesis.converters.QuestionConverter;
import com.media.noesis.dto.ClanDto;
import com.media.noesis.dto.ClanRequest;
import com.media.noesis.dto.QuestionDto;
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
    private final QuestionConverter questionConverter;

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
        repository.findById(id)
                .ifPresentOrElse(
                        original -> {
                            final var modified = converter.toEntity(request, original);
                            repository.save(modified);
                        },
                        () -> new EntityNotFoundException("Clã não localizado!"));
    }

    public void delete(final long id) {
        repository.deleteById(id);
    }

    public void join(final String joinCode, final User user) {
        repository.findByJoinCode(joinCode)
                .ifPresentOrElse(
                        entity -> {
                            entity.getIntegrants().add(user);
                            repository.save(entity);
                        },
                        () -> new EntityNotFoundException("Clã não localizado!"));
    }

    public void leave(final long id, final User user) {
        repository.findById(id)
                .ifPresentOrElse(
                        entity -> {
                            entity.getIntegrants().remove(user);
                            repository.save(entity);
                        },
                        () -> new EntityNotFoundException("Clã não localizado!"));
    }

    public List<QuestionDto> listQuestions(final long id) {
        return repository.findById(id)
                .map(clan -> clan.getQuestions().stream()
                        .map(questionConverter::toDto)
                        .toList())
                .orElseThrow(() -> new EntityNotFoundException("Clã não localizado."));
    }

}
