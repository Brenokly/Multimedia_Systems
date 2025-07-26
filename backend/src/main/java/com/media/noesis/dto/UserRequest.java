package com.media.noesis.dto;

import com.media.noesis.enums.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
