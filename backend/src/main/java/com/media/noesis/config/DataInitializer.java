package com.media.noesis.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.media.noesis.entities.Clan;
import com.media.noesis.entities.User;
import com.media.noesis.enums.Role;
import com.media.noesis.repositories.ClanRepository;
import com.media.noesis.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Componente executado na inicialização da aplicação para garantir que dados
 * essenciais do sistema, como o usuário 'admin' e o 'Clã Global', existam.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClanRepository clanRepository;
    private final PasswordEncoder passwordEncoder;

    // Constantes para evitar "números mágicos" no código
    private static final String ADMIN_EMAIL = "admin@noesis.com";
    private static final String GLOBAL_CLAN_JOIN_CODE = "NOESIS-GLOBAL-CLAN-001";

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Cria o usuário 'admin' se ele não existir
        User systemAdmin = userRepository.findByEmail(ADMIN_EMAIL).orElseGet(() -> {
            User adminUser = new User();
            adminUser.setName("Sistema Noesis");
            adminUser.setEmail(ADMIN_EMAIL);
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(Role.TEACHER);
            adminUser.setAvatarId(1);
            return userRepository.save(adminUser);
        });

        clanRepository.findByJoinCode(GLOBAL_CLAN_JOIN_CODE).orElseGet(() -> {
            Clan globalClan = new Clan();
            globalClan.setName("Quests Globais Noesis");
            globalClan.setJoinCode(GLOBAL_CLAN_JOIN_CODE);
            globalClan.setOwner(systemAdmin);
            return clanRepository.save(globalClan);
        });
    }
}
