package com.media.noesis.converters;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.media.noesis.dto.QuestionDto;
import com.media.noesis.dto.QuestionRequest;
import com.media.noesis.entities.Question;
import com.media.noesis.utils.Converter;

@Component
public class QuestionConverter extends Converter<Question, QuestionDto> {

    public QuestionConverter(final ModelMapper mapper, final TopicConverter topicConverter) {
        super(mapper, Question.class, QuestionDto.class);

        mapper.createTypeMap(QuestionRequest.class, Question.class);
        // .setConverter(ctx -> {
        // final var topics = ctx.getSource().getTopics().stream()
        // .map(topicConverter::toEntity)
        // .toList();

        // return ctx.getDestination().setTopics(topics);
        // })
        // .setPropertyConverter(new org.modelmapper.Converter<List<String>,
        // List<Topic>>() {

        // @Override
        // public List<Topic> convert(MappingContext<List<String>, List<Topic>> context)
        // {
        // return context.getSource().stream()
        // .map(topicConverter::toEntity)
        // .toList();
        // }

        // });
        // .addMapping(QuestionRequest::getTopics, (question, value) -> {
        // if (value != null) {
        // @SuppressWarnings("unchecked")
        // final var topics = ((List<String>) value).stream()
        // .map(topicConverter::toEntity)
        // .toList();

        // question.setTopics(topics);
        // } else {
        // question.setTopics(Collections.emptyList());
        // }
        // });

    }

}
