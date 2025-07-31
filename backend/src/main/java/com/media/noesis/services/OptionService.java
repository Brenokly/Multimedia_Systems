package com.media.noesis.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.media.noesis.converters.OptionConverter;
import com.media.noesis.dto.OptionDto;
import com.media.noesis.dto.OptionRequest;
import com.media.noesis.enums.Role;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.repositories.OptionRepository;
import com.media.noesis.repositories.QuestionRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OptionService {

    private OptionRepository repository;
    private OptionConverter converter;

    private QuestionRepository questionRepository;
    private AuthService authService;

    public List<OptionDto> findAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    public void create(final OptionRequest request, final long questionId) {
        final var author = authService.getLoggedUser();

        if (!Role.TEACHER.equals(author.getRole())) {
            throw new UnauthorizedException("Apenas mestres podem criar opções para quests.");
        } else {
            questionRepository.findById(questionId)
                    .ifPresentOrElse(
                            question -> {
                                final var entity = converter.toEntity(request)
                                        .setQuestion(question);

                                repository.save(entity);
                            },
                            () -> new EntityNotFoundException("Quest não localizada."));
        }
    }

    public OptionDto findById(final long id) {
        return repository.findById(id)
                .map(converter::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Opção não localizada!"));
    }

    @Transactional
    public void update(final long id, final OptionRequest request) {
        repository.findById(id)
                .ifPresentOrElse(
                        original -> {
                            final var modified = converter.toEntity(request, original);
                            repository.save(modified);
                        },
                        () -> new EntityNotFoundException("Opção não localizada!"));
    }

    public void delete(final long id) {
        repository.deleteById(id);
    }

}
