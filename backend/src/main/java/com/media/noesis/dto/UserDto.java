package com.media.noesis.dto;

import com.media.noesis.enums.Role;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDto {

    private long id;
    private String name;
    private String email;
    private int avatarId;
    private Role role;

}
