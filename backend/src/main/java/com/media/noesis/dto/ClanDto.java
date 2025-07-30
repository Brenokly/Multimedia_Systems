package com.media.noesis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClanDto {

    private long id;
    private String joinCode;
    private String name;
    private UserDto owner;

}
