package com.media.noesis.config;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.media.noesis.services.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Filtro customizado que intercepta todas as requisições para validar o token
 * JWT. Ele é executado uma vez por requisição e é o ponto central da
 * autenticação baseada em token.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // 1. Extrai o cabeçalho de autorização da requisição.
        final String authHeader = request.getHeader("Authorization");

        // 2. Se não houver cabeçalho ou não começar com "Bearer ", passa para o próximo filtro.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extrai o token JWT, removendo o prefixo "Bearer ".
        final String jwt = authHeader.substring(7);
        final String username = tokenService.extractUsername(jwt);

        // 4. Se temos o username e o usuário ainda não está autenticado no contexto de segurança...
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 5. Se o token for válido...
            if (tokenService.isTokenValid(jwt, userDetails)) {
                // 6. Cria um token de autenticação que o Spring Security entende.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Credenciais são nulas pois estamos usando token.
                        userDetails.getAuthorities());
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                // 7. Atualiza o SecurityContextHolder, autenticando o usuário para esta requisição.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // 8. Passa a requisição para o próximo filtro na cadeia.
        filterChain.doFilter(request, response);
    }
}
