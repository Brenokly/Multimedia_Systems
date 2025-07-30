package com.media.noesis.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
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
import com.media.noesis.services.AuthService;
import com.media.noesis.services.ClanService;

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

    @GetMapping
    @Operation(summary = "Listar todos", description = "Listar todos os clãs cadastrados.")
    public ResponseEntity<List<ClanDto>> getAll() {
        return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
    }

    @PostMapping("{id}")
    @Transactional
    @Operation(summary = "Cadastrar", description = "Cadastrar um novo clã.")
    public ResponseEntity<ClanDto> create(@RequestBody @Valid final ClanRequest request) {
        try {
            final var owner = authService.getLoggedUser();
            service.create(request, owner);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("{id}")
    @Operation(summary = "Buscar", description = "Buscar um clã pelo ID.")
    public ResponseEntity<ClanDto> getById(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.findById(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

}
