package com.media.noesis.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.media.noesis.dto.ClanDto;
import com.media.noesis.dto.UserDto;
import com.media.noesis.dto.UserRequest;
import com.media.noesis.services.AuthService;
import com.media.noesis.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("v1/core/users")
@Tag(name = "User")
@AllArgsConstructor
public class UserController {

    private final UserService service;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Listar todos", description = "Listar todos os usuários ativos cadastrados.")
    public ResponseEntity<List<UserDto>> getAll() {
        return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    @Operation(summary = "Buscar", description = "Buscar um usuário ativo pelo ID.")
    public ResponseEntity<UserDto> getById(@PathVariable @NotNull final long id) {
        try {
            return new ResponseEntity<>(service.findById(id), HttpStatus.OK);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @PutMapping("{id}")
    @Transactional
    @Operation(summary = "Editar", description = "Editar os dados de um usuário ativo.")
    public ResponseEntity<UserDto> update(@PathVariable @NotNull final long id,
            @RequestBody @Valid final UserRequest request) {
        try {
            service.update(id, request);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @DeleteMapping("{id}")
    @Transactional
    @Operation(summary = "Excluir", description = "Descadastrar um usuário ativo, removendo-o do sistema.")
    public ResponseEntity<UserDto> delete(@PathVariable @NotNull final long id) {
        try {
            service.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (final Exception e) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @GetMapping("managed-clans")
    @Operation(summary = "Listar clãs gerenciados", description = "Listar clãs gerenciados pelo usuário logado.")
    public ResponseEntity<List<ClanDto>> getManagedClans() {
        try {
            final var owner = authService.getLoggedUser();
            final var clans = service.getManagedClans(owner);

            return ResponseEntity.ok(clans);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @GetMapping("joined-clans")
    @Operation(summary = "Listar clãs", description = "Listar clãs do usuário logado.")
    public ResponseEntity<List<ClanDto>> getJoinedClans() {
        try {
            final var owner = authService.getLoggedUser();
            final var clans = service.getJoinedClans(owner);

            return ResponseEntity.ok(clans);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

}
