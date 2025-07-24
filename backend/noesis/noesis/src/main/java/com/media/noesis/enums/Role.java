package com.media.noesis.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Role {

    TEACHER("teacher"),
    STUDENT("student");

    private final String name;

}
