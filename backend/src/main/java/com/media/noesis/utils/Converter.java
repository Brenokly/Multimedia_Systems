package com.media.noesis.utils;

import org.modelmapper.ModelMapper;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public abstract class Converter<E, D> {

    protected final ModelMapper mapper;
    private final Class<E> entityClass;
    private final Class<D> dtoClass;

    public E toEntity(Object source) {
        return mapper.map(source, entityClass);
    }

    public D toDto(Object source) {
        return mapper.map(source, dtoClass);
    }

    public E toEntity(final Object source, final E destiny) {
        mapper.map(source, destiny);
        return destiny;
    }

    public D toDto(final Object source, final D destiny) {
        mapper.map(source, destiny);
        return destiny;
    }

}
