package com.media.noesis.dto;

import com.media.noesis.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public interface UserRequest {

    @Data
    @NoArgsConstructor
    public class Create {

        private String name;

        @Email
        @NotBlank
        private String username;

        @NotBlank
        private String password;

        @NotNull(message = "A escolha de um avatar é obrigatória.")
        @Min(value = 1, message = "ID do avatar inválido.")
        private int avatarId;

        @NotNull
        private Role role;

    }

    @Getter
    @Setter
    public class Update extends Create {

        @NotNull
        private long id;

    }

}
