package com.media.noesis.converters;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.media.noesis.dto.UnitDto;
import com.media.noesis.entities.Unit;
import com.media.noesis.utils.Converter;

@Component
public class UnitConverter extends Converter<Unit, UnitDto> {

    public UnitConverter(final ModelMapper mapper) {
        super(mapper, Unit.class, UnitDto.class);
    }

}
