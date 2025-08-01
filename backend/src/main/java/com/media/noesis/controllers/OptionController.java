package com.media.noesis.controllers;

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

import com.media.noesis.dto.AnswerDto;
import com.media.noesis.dto.OptionDto;
import com.media.noesis.dto.OptionRequest;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.services.OptionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("v1/core/options")
@Tag(name = "Options")
@AllArgsConstructor
public class OptionController {

    private final OptionService service;

    @GetMapping("{id}")
    @Operation(summary = "Buscar", description = "Buscar uma alternativa pelo ID.")
    public ResponseEntity<OptionDto> getById(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.findById(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @PutMapping("{id}")
    @Transactional
    @Operation(summary = "Editar", description = "Editar os dados de uma alternativa.")
    public ResponseEntity<Void> update(@PathVariable @NotNull final long id,
            @RequestBody @Valid final OptionRequest request) {
        try {
            service.update(id, request);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @DeleteMapping("{id}")
    @Transactional
    @Operation(summary = "Excluir", description = "Excluir uma alternativa.")
    public ResponseEntity<Void> delete(@PathVariable @NotNull final long id) {
        try {
            service.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (final Exception e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.EXPECTATION_FAILED, e.getMessage()))
                    .build();
        }
    }

    @PostMapping("{id}/choose")
    @Transactional
    @Operation(summary = "Escolher Resposta", description = "Regista a escolha de uma alternativa por um utilizador.")
    public ResponseEntity<AnswerDto> chooseOption(@PathVariable @NotNull final long id) {
        try {
            final var answerDto = service.choose(id);
            return ResponseEntity.ok(answerDto);
        } catch (final UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
