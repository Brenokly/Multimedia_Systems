package com.media.noesis.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OptionRequest {

    @NotNull
    private boolean correct;

    @NotBlank
    private String assertion;

    private String feedback;

}
