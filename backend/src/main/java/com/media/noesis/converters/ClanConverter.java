package com.media.noesis.converters;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.media.noesis.dto.ClanDto;
import com.media.noesis.entities.Clan;
import com.media.noesis.utils.Converter;

@Component
public class ClanConverter extends Converter<Clan, ClanDto> {

    public ClanConverter(final ModelMapper mapper) {
        super(mapper, Clan.class, ClanDto.class);
    }

}
