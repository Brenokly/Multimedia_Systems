package com.media.noesis.converters;

import org.modelmapper.ModelMapper;

import com.media.noesis.dto.AnswerDto;
import com.media.noesis.entities.Answer;
import com.media.noesis.utils.Converter;

public class AnswerConverter extends Converter<Answer, AnswerDto> {

    public AnswerConverter(final ModelMapper mapper) {
        super(mapper, Answer.class, AnswerDto.class);
    }

}
