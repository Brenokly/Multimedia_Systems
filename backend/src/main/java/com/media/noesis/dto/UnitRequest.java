package com.media.noesis.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UnitRequest {

    @NotBlank
    private String name;

}
