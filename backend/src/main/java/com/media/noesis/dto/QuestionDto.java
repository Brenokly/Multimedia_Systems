package com.media.noesis.dto;

import java.util.List;

import com.media.noesis.entities.Topic;
import com.media.noesis.enums.Level;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QuestionDto {

    private long id;
    private ClanDto clan;
    private Level level;
    private String statement;
    private List<Topic> topics;

}
