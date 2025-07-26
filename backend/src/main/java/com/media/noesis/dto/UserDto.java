package com.media.noesis.dto;

import com.media.noesis.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private long id;
    private String name;
    private String username;
    private int avatarId;
    private Role role;
}
