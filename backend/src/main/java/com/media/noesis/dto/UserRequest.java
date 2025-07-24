package com.media.noesis.dto;

import com.media.noesis.enums.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public interface UserRequest {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Create {
        private String name;

        @NotBlank
        private String username;

        @NotBlank
        private String password;

        @NotBlank
        private Role role;
    }

    public class Update extends Create {
        @NotNull
        private long id;
    }

}
