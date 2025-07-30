package com.media.noesis.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.media.noesis.converters.QuestionConverter;
import com.media.noesis.converters.TopicConverter;
import com.media.noesis.dto.QuestionDto;
import com.media.noesis.dto.QuestionRequest;
import com.media.noesis.entities.User;
import com.media.noesis.enums.Role;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.repositories.ClanRepository;
import com.media.noesis.repositories.QuestionRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class QuestionService {

    private final QuestionRepository repository;
    private final QuestionConverter converter;
    private final TopicConverter topicConverter;

    private final ClanRepository clanRepository;

    public List<QuestionDto> findAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    public void create(final QuestionRequest request, final User author, final long clanId) {
        final var clan = clanRepository.findById(clanId)
                .orElseThrow(() -> new EntityNotFoundException("Clã não localizado."));

        if (!Role.TEACHER.equals(author.getRole())) {
            throw new UnauthorizedException("Apenas mestres podem criar quests.");
        } else if (!author.equals(clan.getOwner())) {
            throw new UnauthorizedException("Mestres podem criar quests apenas para os seus próprios clãs.");
        } else {
            final var entity = converter.toEntity(request)
                    .setAuthor(author)
                    .setClan(clan)
                    .setTopics(request.getTopics().stream()
                            .map(topicConverter::toEntity)
                            .toList());

            repository.save(entity);
        }
    }

    public QuestionDto findById(final long id) {
        return repository.findById(id)
                .map(converter::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Quest não localizada!"));
    }

    public void update(final long id, final QuestionRequest request) {
        repository.findById(id)
                .ifPresentOrElse(
                        original -> {
                            final var modified = converter.toEntity(request, original)
                                    .setTopics(request.getTopics().stream()
                                            .map(topicConverter::toEntity)
                                            .toList());
                            repository.save(modified);
                        },
                        () -> new EntityNotFoundException("Quest não localizada!"));
    }

    public void delete(final long id) {
        repository.deleteById(id);
    }

}
