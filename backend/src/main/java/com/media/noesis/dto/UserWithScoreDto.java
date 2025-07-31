package com.media.noesis.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserWithScoreDto extends UserDto {

    private long score;

    public UserWithScoreDto(final UserDto userDto) {
        setId(userDto.getId());
        setName(userDto.getName());
        setEmail(userDto.getEmail());
        setAvatarId(userDto.getAvatarId());
        setRole(userDto.getRole());
    }

    public UserDto asSuper() {
        return this;
    }

}
