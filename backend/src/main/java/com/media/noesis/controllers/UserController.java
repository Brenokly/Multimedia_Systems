package com.media.noesis.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.media.noesis.dto.ClanDto;
import com.media.noesis.dto.UserDto;
import com.media.noesis.dto.UserRequest;
import com.media.noesis.dto.UserWithScoreDto;
import com.media.noesis.exceptions.UnauthorizedException;
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

    @PutMapping("{id}/profile")
    @Transactional
    @Operation(summary = "Editar Perfil", description = "Editar o nome e o avatar de um utilizador.")
    public ResponseEntity<Void> updateProfile(@PathVariable @NotNull final long id,
            @RequestBody @Valid final UserRequest.UpdateProfile request) {
        try {
            service.updateProfile(id, request);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("{id}/password")
    @Transactional
    @Operation(summary = "Editar Palavra-passe", description = "Editar a palavra-passe de um utilizador.")
    public ResponseEntity<Void> updatePassword(@PathVariable @NotNull final long id,
            @RequestBody @Valid final UserRequest.UpdatePassword request) {
        try {
            service.updatePassword(id, request);
            return ResponseEntity.noContent().build();
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (final UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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

    @GetMapping("students")
    @Operation(summary = "Listar alunos", description = "Listar todos os alunos.")
    public ResponseEntity<List<UserDto>> listStudents() {
        return new ResponseEntity<>(service.listStudents(), HttpStatus.OK);
    }

    @GetMapping("teachers")
    @Operation(summary = "Listar professores", description = "Listar todos os professores.")
    public ResponseEntity<List<UserDto>> listTeachers() {
        return new ResponseEntity<>(service.listTeachers(), HttpStatus.OK);
    }

    @GetMapping("ranking")
    @Operation(summary = "Ranking", description = "Exibe o ranking de pontuação. Pode ser filtrado por clã.")
    public ResponseEntity<Page<UserWithScoreDto>> getRanking(
            Pageable pageable,
            @RequestParam(required = false) Long clanId) {

        return new ResponseEntity<>(service.getRanking(pageable, clanId), HttpStatus.OK);
    }

    @GetMapping("managed-clans")
    @Operation(summary = "Listar meus clãs gerenciados", description = "Listar clãs gerenciados pelo usuário logado.")
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
    @Operation(summary = "Listar meus clãs", description = "Listar clãs do usuário logado.")
    public ResponseEntity<List<ClanDto>> getJoinedClans() {
        try {
            final var owner = authService.getLoggedUser();
            final var clans = service.getJoinedClans(owner);

            return ResponseEntity.ok(clans);
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @GetMapping("score")
    @Operation(summary = "Obter minha pontuação", description = "Obter pontuação de usuário.")
    public ResponseEntity<Long> getMyScore() {
        final var user = authService.getLoggedUser();
        return getScore(user.getId());
    }

    @GetMapping("{id}/score")
    @Operation(summary = "Obter pontuação", description = "Obter pontuação de usuário.")
    public ResponseEntity<Long> getScore(@PathVariable @NotNull final long id) {
        try {
            return ResponseEntity.ok(service.getScore(id));
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }

    @GetMapping("{id}/score-by-clan/{clanId}")
    @Operation(summary = "Obter pontuação por clã", description = "Obter pontuação de usuário em determinado clã.")
    public ResponseEntity<Long> getScore(@PathVariable @NotNull final long id,
            @PathVariable @NotNull final long clanId) {
        try {
            return ResponseEntity.ok(service.getScore(id, clanId));
        } catch (final EntityNotFoundException e) {
            return ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage())).build();
        }
    }
}
