package com.media.noesis.dto;

import com.media.noesis.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDto {

    public record LoginRequest(
            @NotBlank
            @Email String email,
            @NotBlank String password) {

    }

    public record UserLoginInfo(
            long id,
            String name,
            String email,
            int avatarId,
            Role role) {

    }

    public record LoginResponse(
            String token,
            UserLoginInfo user) {

    }

}
