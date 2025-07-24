package com.media.noesis.converters;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.media.noesis.dto.UserDto;
import com.media.noesis.entities.User;
import com.media.noesis.utils.Converter;

@Component
public class UserConverter extends Converter<User, UserDto> {

    public UserConverter(final ModelMapper mapper) {
        super(mapper, User.class, UserDto.class);
    }

}
