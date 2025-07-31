package com.media.noesis.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.media.noesis.converters.QuestionConverter;
import com.media.noesis.converters.UnitConverter;
import com.media.noesis.dto.QuestionDto;
import com.media.noesis.dto.UnitDto;
import com.media.noesis.dto.UnitRequest;
import com.media.noesis.enums.Role;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.repositories.ClanRepository;
import com.media.noesis.repositories.UnitRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UnitService {

    private final UnitRepository repository;
    private final UnitConverter converter;

    private final QuestionConverter questionConverter;
    private final ClanRepository clanRepository;
    private final AuthService authService;

    public List<UnitDto> findAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    public void create(final UnitRequest request, final long clanId) throws UnauthorizedException {
        final var user = authService.getLoggedUser();

        final var clan = clanRepository.findById(clanId)
                .orElseThrow(() -> new EntityNotFoundException("Clã não localizado."));

        if (!Role.TEACHER.equals(user.getRole())) {
            throw new UnauthorizedException("Apenas mestres podem criar unidades.");
        } else if (!user.equals(clan.getOwner())) {
            throw new UnauthorizedException("Mestres podem criar unidades apenas para os seus próprios clãs.");
        } else {
            final var entity = converter.toEntity(request)
                    .setClan(clan);

            repository.save(entity);
        }
    }

    public UnitDto findById(final long id) {
        return repository.findById(id)
                .map(converter::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Unidade não localizada!"));
    }

    public void update(final long id, final UnitRequest request) {
        repository.findById(id)
                .ifPresentOrElse(
                        original -> {
                            final var modified = converter.toEntity(request, original);
                            repository.save(modified);
                        },
                        () -> new EntityNotFoundException("Unidade não localizada!"));
    }

    public void delete(final long id) {
        repository.deleteById(id);
    }

    public List<QuestionDto> listQuestions(final long id) {
        return repository.findById(id)
                .map(clan -> clan.getQuestions().stream()
                .map(questionConverter::toDto)
                .toList())
                .orElseThrow(() -> new EntityNotFoundException("Clã não localizado."));
    }

}
