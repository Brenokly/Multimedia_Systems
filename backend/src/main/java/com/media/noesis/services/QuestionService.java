package com.media.noesis.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.media.noesis.converters.AnswerConverter;
import com.media.noesis.converters.OptionConverter;
import com.media.noesis.converters.QuestionConverter;
import com.media.noesis.converters.TopicConverter;
import com.media.noesis.converters.UserConverter;
import com.media.noesis.dto.AnswerDto;
import com.media.noesis.dto.AnswerWithDetailsDto;
import com.media.noesis.dto.QuestionDto;
import com.media.noesis.dto.QuestionRequest;
import com.media.noesis.entities.Answer;
import com.media.noesis.entities.User;
import com.media.noesis.enums.Role;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.repositories.QuestionRepository;
import com.media.noesis.repositories.UnitRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class QuestionService {

    private final QuestionRepository repository;
    private final QuestionConverter converter;

    private final UserConverter userConverter;
    private final TopicConverter topicConverter;
    private final OptionConverter optionConverter;
    private final AnswerConverter answerConverter;
    private final UnitRepository unitRepository;

    public List<QuestionDto> findAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    public void create(final QuestionRequest.Create request, final User author, final long unitId)
            throws UnauthorizedException {
        final var unit = unitRepository.findById(unitId)
                .orElseThrow(() -> new EntityNotFoundException("Clã não localizado."));

        if (!Role.TEACHER.equals(author.getRole())) {
            throw new UnauthorizedException("Apenas mestres podem criar quests.");
        } else if (!author.equals(unit.getClan().getOwner())) {
            throw new UnauthorizedException("Mestres podem criar quests apenas para os seus próprios clãs.");
        } else {
            final var entity = converter.toEntity(request)
                    .setAuthor(author)
                    .setUnit(unit);
            entity.getOptions().forEach(option -> option.setQuestion(entity));

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
                            final var modified = converter.toEntity(request, original);
                            repository.save(modified);

                            modified.setTopics(request.getTopics().stream()
                                    .map(topicConverter::toEntity)
                                    .toList());
                        },
                        () -> new EntityNotFoundException("Quest não localizada!"));
    }

    public void delete(final long id) {
        repository.deleteById(id);
    }

    public List<QuestionDto> findByAuthorId(long authorId) {
        return repository.findByAuthorId(authorId).stream()
                .map(converter::toDto)
                .toList();
    }

    public List<AnswerDto> listAnswers(final long id) {
        return repository.findById(id)
                .map(question -> {
                    return question.getOptions().stream()
                            .flatMap(option -> option.getAnswers().stream()
                            .map(answerConverter::toDto))
                            .toList();
                })
                .orElseThrow(() -> new EntityNotFoundException("Quest não localizada!"));
    }

    public List<AnswerWithDetailsDto> listAnswersWithDeitais(final long id) {
        return repository.findById(id)
                .map(question -> {
                    return question.getOptions().stream()
                            .flatMap(option -> option.getAnswers().stream()
                            .map(answer -> new AnswerWithDetailsDto()
                            .setId(answer.getId())
                            .setOption(optionConverter.toDto(answer.getOption()))
                            .setUser(userConverter.toDto(answer.getUser()))
                            .setTimestamp(answer.getTimestamp())))
                            .toList();
                })
                .orElseThrow(() -> new EntityNotFoundException("Quest não localizada!"));
    }

    public Optional<Answer> findUserAnswerForQuestion(long questionId, User user) {
        return repository.findById(questionId)
                .flatMap(question -> question.getOptions().stream()
                .flatMap(option -> option.getAnswers().stream())
                .filter(answer -> answer.getUser().getId() == user.getId())
                .findFirst()
                );
    }
}
