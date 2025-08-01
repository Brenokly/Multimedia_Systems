package com.media.noesis.converters;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.media.noesis.dto.AnswerDto;
import com.media.noesis.entities.Answer;
import com.media.noesis.utils.Converter;

@Component
public class AnswerConverter extends Converter<Answer, AnswerDto> {

    public AnswerConverter(final ModelMapper mapper) {
        super(mapper, Answer.class, AnswerDto.class);
    }

    public AnswerDto toDto(final Answer source) {
        return super.toDto(source)
                .setCorrect(source.getOption().isCorrect());
    }

}
