package com.media.noesis.dto;

import java.util.List;

import com.media.noesis.enums.Level;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QuestionRequest {

    @Data
    @NoArgsConstructor
    @EqualsAndHashCode(callSuper = true)
    public static class Create extends QuestionRequest {
        @NotEmpty
        private List<OptionRequest> options;
    }

    private Level level;

    @NotBlank
    private String statement;

    private List<String> topics;

}
