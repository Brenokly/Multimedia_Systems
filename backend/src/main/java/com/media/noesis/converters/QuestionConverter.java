package com.media.noesis.converters;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.media.noesis.dto.QuestionDto;
import com.media.noesis.entities.Question;
import com.media.noesis.entities.Topic;
import com.media.noesis.utils.Converter;

@Component
public class QuestionConverter extends Converter<Question, QuestionDto> {

    public QuestionConverter(final ModelMapper mapper, final TopicConverter topicConverter) {
        super(mapper, Question.class, QuestionDto.class);

        mapper.addConverter(context -> context.getSource().getName(), Topic.class, String.class);
        mapper.addConverter(context -> topicConverter.toEntity(context.getSource()), String.class, Topic.class);
    }

}
