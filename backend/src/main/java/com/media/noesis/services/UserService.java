package com.media.noesis.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.media.noesis.converters.ClanConverter;
import com.media.noesis.converters.UserConverter;
import com.media.noesis.dto.ClanDto;
import com.media.noesis.dto.UserDto;
import com.media.noesis.dto.UserRequest;
import com.media.noesis.entities.Clan;
import com.media.noesis.entities.User;
import com.media.noesis.enums.Role;
import com.media.noesis.repositories.ClanRepository;
import com.media.noesis.repositories.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserConverter converter;
    private final ClanRepository clanRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClanConverter clanConverter;

    private static final String GLOBAL_CLAN_JOIN_CODE = "NOESIS-GLOBAL-CLAN-001";

    public List<UserDto> findAll() {
        return repository.findAll().stream()
                .map(converter::toDto)
                .toList();
    }

    @Transactional
    public void create(final UserRequest request) {
        final User entity = new User();
        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setAvatarId(request.getAvatarId());
        entity.setRole(request.getRole());
        entity.setPassword(passwordEncoder.encode(request.getPassword()));

        final User savedUser = repository.save(entity);

        if (savedUser.getRole() == Role.STUDENT) {
            clanRepository.findByJoinCode(GLOBAL_CLAN_JOIN_CODE).ifPresentOrElse(
                    globalClan -> {
                        globalClan.getIntegrants().add(savedUser);
                        clanRepository.save(globalClan);
                    },
                    () -> {
                        throw new IllegalStateException("Clã Global com código '" + GLOBAL_CLAN_JOIN_CODE + "' não encontrado. O novo usuário não foi adicionado.");
                    }
            );
        }
    }

    public UserDto findById(final long id) {
        return repository.findById(id)
                .map(converter::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Usuário com id " + id + " não encontrado."));
    }

    @Transactional
    public void update(final long id, final UserRequest request) {
        final User entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                "Usuário com id " + id + " não encontrado para atualização."));

        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setAvatarId(request.getAvatarId());
        entity.setRole(request.getRole());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            entity.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        repository.save(entity);
    }

    @Transactional
    public void delete(final long id) {
        repository.deleteById(id);
    }

    public long getScore(final long id) {
        return repository.findById(id)
                .map(user -> user.getAnswers().stream()
                        .filter(answer -> answer.getOption().isCorrect())
                        .count())
                .orElseThrow(() -> new EntityNotFoundException("Usuário com id " + id + " não encontrado."));
    }

    public List<UserDto> listStudents() {
        return repository.findByRole(Role.STUDENT).stream()
                .map(converter::toDto)
                .toList();
    }

    public List<UserDto> listTeachers() {
        return repository.findByRole(Role.TEACHER).stream()
                .map(converter::toDto)
                .toList();
    }

    public List<ClanDto> getManagedClans(final User owner) {
        return owner.getManagedClans().stream()
                .map(clanConverter::toDto)
                .toList();
    }

    public List<ClanDto> getJoinedClans(final User integrant) {
        List<Clan> joinedClans = integrant.getJoinedClans();
        return joinedClans.stream()
                .map(clanConverter::toDto)
                .toList();
    }

}
