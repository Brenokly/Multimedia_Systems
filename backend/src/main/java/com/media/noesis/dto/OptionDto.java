package com.media.noesis.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OptionDto {

    private long id;
    private boolean correct;
    private String assertion;
    private String feedback;

}
