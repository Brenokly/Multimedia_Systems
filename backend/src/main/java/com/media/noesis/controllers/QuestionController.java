package com.media.noesis.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.media.noesis.converters.AnswerConverter;
import com.media.noesis.dto.AnswerDto;
import com.media.noesis.dto.AnswerWithDetailsDto;
import com.media.noesis.dto.OptionRequest;
import com.media.noesis.dto.QuestionDto;
import com.media.noesis.dto.QuestionRequest;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.exceptions.UnauthorizedException.RuntimeUnauthorizedException;
import com.media.noesis.services.AuthService;
import com.media.noesis.services.OptionService;
import com.media.noesis.services.QuestionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("v1/core/questions")
@Tag(name = "Questions")
@AllArgsConstructor
public class QuestionController {

    private final QuestionService service;
    private final OptionService optionService;
    private final AuthService authService;
    private final AnswerConverter answerConverter;

    @GetMapping
    @Operation(summary = "Listar todas", description = "Listar todas as quests cadastradas.")
    public ResponseEntity<List<QuestionDto>> getAll() {
        return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    @Operation(summary = "Buscar", description = "Buscar uma quest pelo ID.")
    public ResponseEntity<QuestionDto> getById(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.findById(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @PutMapping("{id}")
    @Transactional
    @Operation(summary = "Editar", description = "Editar os dados de uma quest.")
    public ResponseEntity<QuestionDto> update(@PathVariable @NotNull final long id,
            @RequestBody @Valid final QuestionRequest request) {
        try {
            service.update(id, request);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @DeleteMapping("{id}")
    @Transactional
    @Operation(summary = "Excluir", description = "Excluir uma quest.")
    public ResponseEntity<QuestionDto> delete(@PathVariable @NotNull final long id) {
        try {
            service.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (final Exception e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.EXPECTATION_FAILED, e.getMessage()))
                    .build();
        }
    }

    @PostMapping("")
    @Transactional
    @Operation(summary = "Adicionar alternativas", description = "Adicionar alternativas a uma quest.")
    public ResponseEntity<QuestionDto> addOptions(@PathVariable @NotNull final long id,
            @RequestBody @Valid final List<OptionRequest> request) {
        try {
            request.forEach(option -> {
                try {
                    optionService.create(option, id);
                } catch (final UnauthorizedException e) {
                    throw e.asRuntime();
                }
            });
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @GetMapping("{id}/answers")
    @Operation(summary = "Listar respostas dos alunos", description = "Listar todas as quests cadastradas.")
    public ResponseEntity<List<AnswerWithDetailsDto>> listAnswers(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.listAnswersWithDeitais(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        } catch (final RuntimeUnauthorizedException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage())).build();
        }
    }

    @GetMapping("author/{authorId}")
    @Operation(summary = "Buscar por autor", description = "Buscar questões por ID do autor.")
    public ResponseEntity<List<QuestionDto>> getByAuthorId(@PathVariable @NotNull final long authorId) {
        return new ResponseEntity<>(service.findByAuthorId(authorId), HttpStatus.OK);
    }

    @GetMapping("{id}/my-answer")
    @Operation(summary = "Buscar Minha Resposta", description = "Busca a resposta do utilizador logado para esta quest.")
    public ResponseEntity<AnswerDto> getMyAnswer(@PathVariable @NotNull final long id) {
        try {
            final var user = authService.getLoggedUser();
            return service.findUserAnswerForQuestion(id, user)
                    .map(answerConverter::toDto) // Converte a entidade Answer para AnswerDto
                    .map(ResponseEntity::ok) // Se encontrar, retorna 200 OK com o DTO
                    .orElse(ResponseEntity.notFound().build()); // Se não, retorna 404 Not Found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
