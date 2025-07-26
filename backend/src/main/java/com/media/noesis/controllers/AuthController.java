package com.media.noesis.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.media.noesis.dto.AuthDto;
import com.media.noesis.dto.UserRequest;
import com.media.noesis.entities.User;
import com.media.noesis.services.TokenService;
import com.media.noesis.services.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/v1/auth")
@Tag(name = "Authentication")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.LoginResponse> login(@RequestBody @Valid AuthDto.LoginRequest data) {
        // Cria um objeto de autenticação com os dados recebidos
        var authToken = new UsernamePasswordAuthenticationToken(data.username(), data.password());

        // O Spring Security autentica o usuário
        var authentication = authenticationManager.authenticate(authToken);

        // Se a autenticação for bem-sucedida, gera o token
        var user = (User) authentication.getPrincipal();
        String token = tokenService.generateToken(user);

        // Cria o DTO com as informações do usuário para a resposta
        var userInfo = new AuthDto.UserLoginInfo(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getRole()
        );

        // Retorna o token e as informações do usuário
        return ResponseEntity.ok(new AuthDto.LoginResponse(token, userInfo));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid UserRequest.Create data) {
        // Delega a criação para o UserService, que já criptografa a senha
        userService.create(data);
        return ResponseEntity.status(201).build();
    }
}
