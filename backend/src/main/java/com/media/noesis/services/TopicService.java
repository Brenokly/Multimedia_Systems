package com.media.noesis.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.media.noesis.converters.QuestionConverter;
import com.media.noesis.converters.TopicConverter;
import com.media.noesis.dto.QuestionDto;
import com.media.noesis.repositories.TopicRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TopicService {

    private static final String NOT_FOUND_MESSAGE = "Tópico não localizado.";

    private final TopicRepository repository;
    private final TopicConverter converter;

    private final QuestionConverter questionConverter;

    public List<String> findAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    public void update(final long id, final String name) {
        repository.findById(id)
                .ifPresentOrElse(
                        // Se encontrar, editar
                        topic -> repository.save(topic.setName(name)),

                        // Senão, lançar exceção
                        () -> new EntityNotFoundException(NOT_FOUND_MESSAGE));
    }

    public void delete(final long id) {
        repository.deleteById(id);
    }

    public List<QuestionDto> listQuestions(final long id) {
        return repository.findById(id)

                // Se encontrar, transformar e listar
                .map(topic -> topic.getQuestions().stream()
                        .map(questionConverter::toDto)
                        .toList())

                // Senão, lançar exceção
                .orElseThrow(() -> new EntityNotFoundException(NOT_FOUND_MESSAGE));
    }

}
