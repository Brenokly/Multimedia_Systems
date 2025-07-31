package com.media.noesis.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AnswerDto {

    private long id;
    private long userId;
    private long optionId;
    private boolean correct;
    private LocalDateTime timestamp;

}
