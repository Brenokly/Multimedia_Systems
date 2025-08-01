package com.media.noesis.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.media.noesis.converters.AnswerConverter;
import com.media.noesis.converters.OptionConverter;
import com.media.noesis.dto.AnswerDto;
import com.media.noesis.dto.OptionDto;
import com.media.noesis.dto.OptionRequest;
import com.media.noesis.entities.Answer;
import com.media.noesis.enums.Role;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.exceptions.UnauthorizedException.RuntimeUnauthorizedException;
import com.media.noesis.repositories.OptionRepository;
import com.media.noesis.repositories.QuestionRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OptionService {

    private static final String NOT_FOUND_MESSAGE = "Alternativa não localizada!";

    private final OptionRepository repository;
    private final OptionConverter converter;

    private final AuthService authService;
    private final QuestionService questionService;
    private final AnswerConverter answerConverter;
    private final QuestionRepository questionRepository;

    public List<OptionDto> findAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    public void create(final OptionRequest request, final long questionId) throws UnauthorizedException {
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
                .orElseThrow(() -> new EntityNotFoundException(NOT_FOUND_MESSAGE));
    }

    @Transactional
    public void update(final long id, final OptionRequest request) {
        repository.findById(id)
                .ifPresentOrElse(
                        original -> {
                            final var modified = converter.toEntity(request, original);
                            repository.save(modified);
                        },
                        () -> new EntityNotFoundException(NOT_FOUND_MESSAGE));
    }

    public void delete(final long id) {
        repository.deleteById(id);
    }

    public AnswerDto choose(final long id) throws UnauthorizedException {
        try {
            return repository.findById(id)
                    // Se a alternativa for encontrada...
                    .map(option -> {
                        // Obter usuário logado
                        final var user = authService.getLoggedUser();

                        // Barrar usuário de responder a mesma questão mais de uma vez
                        if (questionService.listAnswers(option.getQuestion().getId()).stream()
                                .anyMatch(ans -> ans.getUserId() == user.getId())) {
                            throw new UnauthorizedException("Você já havia respondido a esta quest!").asRuntime();
                        }

                        // Criar nova entidade de resposta
                        final var answer = new Answer()
                                .setOption(option)
                                .setUser(user)
                                .setTimestamp(LocalDateTime.now());

                        // Salvar no banco de dados
                        option.getAnswers().add(answer);
                        repository.save(option);

                        // Transformar em DTO e retornar
                        return answerConverter.toDto(answer);
                    })
                    // Se a alternativa não for encontrada...
                    .orElseThrow(() -> new EntityNotFoundException(NOT_FOUND_MESSAGE));
        } catch (RuntimeUnauthorizedException e) {
            throw e.getSource();
        }
    }

}
