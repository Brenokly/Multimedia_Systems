package com.media.noesis.dto;

import com.media.noesis.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public interface UserRequest {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class Create {
        @NotBlank
        private String name;

        @Email
        @NotBlank
        private String email;

        @NotBlank
        @Size(min = 8, message = "A palavra-passe deve ter no mínimo 8 caracteres.")
        private String password;

        @NotNull(message = "A escolha de um avatar é obrigatória.")
        @Min(value = 1, message = "ID do avatar inválido.")
        private int avatarId;

        @NotNull
        private Role role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class UpdateProfile {
        @NotBlank
        @Size(min = 3, max = 30)
        private String name;

        @NotNull
        @Min(1)
        private int avatarId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class UpdatePassword {
        @NotBlank
        private String currentPassword;

        @NotBlank
        @Size(min = 8)
        private String newPassword;
    }
}
