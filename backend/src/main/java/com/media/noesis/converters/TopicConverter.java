package com.media.noesis.converters;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.media.noesis.entities.Topic;
import com.media.noesis.repositories.TopicRepository;
import com.media.noesis.utils.Converter;

@Component
public class TopicConverter extends Converter<Topic, String> {

    private final TopicRepository repository;

    public TopicConverter(final ModelMapper mapper, final TopicRepository repository) {
        super(mapper, Topic.class, String.class);
        this.repository = repository;
    }

    public Topic toEntity(final String source) {
        return repository.findByName(source)
                .orElseGet(() -> {
                    return new Topic().setName(source);
                });
    }

    public Topic toEntity(final String source, final Topic destiny) {
        return destiny.setName(source);
    }

    public String toDto(final Topic source) {
        return source.getName();
    }

    public String toDto(final Topic source, final String ignoredDestiny) {
        return source.getName();
    }

}
