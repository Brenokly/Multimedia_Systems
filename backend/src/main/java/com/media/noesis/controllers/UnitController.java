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

import com.media.noesis.dto.QuestionDto;
import com.media.noesis.dto.QuestionRequest;
import com.media.noesis.dto.UnitDto;
import com.media.noesis.dto.UnitRequest;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.services.AuthService;
import com.media.noesis.services.QuestionService;
import com.media.noesis.services.UnitService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("v1/core/units")
@Tag(name = "Unit")
@AllArgsConstructor
public class UnitController {

    private final UnitService service;

    private final AuthService authService;
    private final QuestionService questionService;

    @GetMapping("{id}")
    @Operation(summary = "Buscar", description = "Buscar uma unidade pelo ID.")
    public ResponseEntity<UnitDto> getById(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.findById(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @PutMapping("{id}")
    @Transactional
    @Operation(summary = "Editar", description = "Editar os dados de uma unidade.")
    public ResponseEntity<UnitDto> update(@PathVariable @NotNull final long id,
            @RequestBody @Valid final UnitRequest request) {
        try {
            service.update(id, request);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @DeleteMapping("{id}")
    @Transactional
    @Operation(summary = "Excluir", description = "Excluir uma unidade.")
    public ResponseEntity<UnitDto> delete(@PathVariable @NotNull final long id) {
        try {
            service.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (final Exception e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.EXPECTATION_FAILED, e.getMessage()))
                    .build();
        }
    }

    @PostMapping("{id}/questions")
    @Transactional
    @Operation(summary = "Cadastrar quest", description = "Cadastrar uma nova quest.")
    public ResponseEntity<QuestionDto> createQuestion(@PathVariable @NotNull final long id,
            @RequestBody @Valid final QuestionRequest.Create request) {
        try {
            final var owner = authService.getLoggedUser();
            questionService.create(request, owner, id);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        } catch (final UnauthorizedException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage())).build();
        }
    }

    @GetMapping("{id}/questions")
    @Operation(summary = "Listar questões", description = "Listar questões de um clã.")
    public ResponseEntity<List<QuestionDto>> listQuestions(@PathVariable @NotNull final long id) {
        try {
            final var questions = service.listQuestions(id);
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

}
