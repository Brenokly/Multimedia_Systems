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

import com.media.noesis.dto.ClanDto;
import com.media.noesis.dto.ClanRequest;
import com.media.noesis.dto.QuestionDto;
import com.media.noesis.dto.UnitDto;
import com.media.noesis.dto.UnitRequest;
import com.media.noesis.exceptions.UnauthorizedException;
import com.media.noesis.services.AuthService;
import com.media.noesis.services.ClanService;
import com.media.noesis.services.UnitService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("v1/core/clans")
@Tag(name = "Clan")
@AllArgsConstructor
public class ClanController {

    private final ClanService service;

    private final AuthService authService;
    private final UnitService unitService;

    @GetMapping
    @Operation(summary = "Listar todos", description = "Listar todos os clãs cadastrados.")
    public ResponseEntity<List<ClanDto>> getAll() {
        return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
    }

    @PostMapping
    @Transactional
    @Operation(summary = "Cadastrar", description = "Cadastrar um novo clã.")
    public ResponseEntity<ClanDto> create(@RequestBody @Valid final ClanRequest request) {
        try {
            final var owner = authService.getLoggedUser();
            service.create(request, owner);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        } catch (final UnauthorizedException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage())).build();
        }
    }

    @GetMapping("{id}")
    @Operation(summary = "Buscar", description = "Buscar um clã pelo ID.")
    public ResponseEntity<ClanDto> getById(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.findById(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @PutMapping("{id}")
    @Transactional
    @Operation(summary = "Editar", description = "Editar os dados de um clã.")
    public ResponseEntity<ClanDto> update(@PathVariable @NotNull final long id,
            @RequestBody @Valid final ClanRequest request) {
        try {
            service.update(id, request);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @DeleteMapping("{id}")
    @Transactional
    @Operation(summary = "Excluir", description = "Excluir um clã.")
    public ResponseEntity<ClanDto> delete(@PathVariable @NotNull final long id) {
        try {
            service.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (final Exception e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.EXPECTATION_FAILED, e.getMessage()))
                    .build();
        }
    }

    @PostMapping("{joinCode}/join")
    @Transactional
    @Operation(summary = "Ingressar", description = "Juntar-se a um clã.")
    public ResponseEntity<ClanDto> join(@PathVariable @NotNull final String joinCode) {
        try {
            final var integrant = authService.getLoggedUser();
            service.join(joinCode, integrant);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @PostMapping("{id}/leave")
    @Transactional
    @Operation(summary = "Abandonar", description = "Sair de um clã.")
    public ResponseEntity<ClanDto> leave(@PathVariable @NotNull final long id) {
        try {
            final var integrant = authService.getLoggedUser();
            service.leave(id, integrant);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @PostMapping("{id}/units")
    @Transactional
    @Operation(summary = "Cadastrar unidade", description = "Cadastrar uma nova unidade.")
    public ResponseEntity<UnitDto> createUnit(@PathVariable @NotNull final long id,
            @RequestBody @Valid final UnitRequest request) {
        try {
            unitService.create(request, id);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        } catch (final UnauthorizedException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage())).build();
        }
    }

    @GetMapping("{id}/units")
    @Operation(summary = "Listar unidades", description = "Listar unidades de um clã.")
    public ResponseEntity<List<UnitDto>> listUnits(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.listUnits(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @GetMapping("{id}/questions")
    @Operation(summary = "Listar questões", description = "Listar questões de um clã.")
    public ResponseEntity<List<QuestionDto>> listQuestions(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.listQuestions(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @GetMapping("{id}/topics")
    @Operation(summary = "Listar questões", description = "Listar questões de um clã.")
    public ResponseEntity<List<String>> listTopics(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.listTopics(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

}
