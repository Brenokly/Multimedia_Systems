package com.media.noesis.dto;

import com.media.noesis.enums.Role;

import jakarta.validation.constraints.NotBlank;

public class AuthDto {

    // DTO para a requisição de login que o frontend envia.
    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password) {

    }

    // DTO com os dados essenciais do usuário para serem retornados no login.
    public record UserLoginInfo(
            long id,
            String name,
            String username,
            Role role) {

    }

    // DTO para a resposta do login, contendo o token JWT e os dados do usuário.
    public record LoginResponse(
            String token,
            UserLoginInfo user) {

    }
}
