package com.media.noesis.exceptions;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UnauthorizedException extends Exception {

    @Getter
    public static class RuntimeUnauthorizedException extends RuntimeException {

        final UnauthorizedException source;

        public RuntimeUnauthorizedException(final String message, final UnauthorizedException cause) {
            super(message, cause);
            source = cause;
        }
    }

    public UnauthorizedException(final String message) {
        super(message);
    }

    public RuntimeUnauthorizedException asRuntime() {
        return new RuntimeUnauthorizedException(this.getMessage(), this);
    }

}
