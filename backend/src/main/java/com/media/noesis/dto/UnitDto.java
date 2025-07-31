package com.media.noesis.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UnitDto {

    private long id;
    private long clanId;
    private String name;
    private int totalQuestions;

}
