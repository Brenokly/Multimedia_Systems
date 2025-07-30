package com.media.noesis.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClanRequest {

    @NotBlank
    private String name;

    private String joinCode;

}
