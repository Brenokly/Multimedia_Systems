package com.media.noesis.converters;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.media.noesis.dto.OptionDto;
import com.media.noesis.entities.Option;
import com.media.noesis.utils.Converter;

@Component
public class OptionConverter extends Converter<Option, OptionDto> {

    public OptionConverter(final ModelMapper mapper) {
        super(mapper, Option.class, OptionDto.class);
    }

}
