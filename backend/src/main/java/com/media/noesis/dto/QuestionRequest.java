package com.media.noesis.dto;

import java.util.List;

import com.media.noesis.enums.Level;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QuestionRequest {

    private Level level;
    private String statement;
    private List<String> topics;

}
