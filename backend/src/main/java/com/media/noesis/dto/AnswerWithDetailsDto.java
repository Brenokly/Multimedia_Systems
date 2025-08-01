package com.media.noesis.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AnswerWithDetailsDto {

    private long id;
    private UserDto user;
    private OptionDto option;
    private LocalDateTime timestamp;

}
