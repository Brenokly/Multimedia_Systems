package com.media.noesis.services;

import java.util.Collections;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.media.noesis.converters.ClanConverter;
import com.media.noesis.converters.UserConverter;
import com.media.noesis.dto.ClanDto;
import com.media.noesis.dto.UserDto;
import com.media.noesis.dto.UserRequest;
import com.media.noesis.dto.UserWithScoreDto;
import com.media.noesis.entities.Answer;
import com.media.noesis.entities.Clan;
import com.media.noesis.entities.User;
import com.media.noesis.enums.Role;
import com.media.noesis.exceptions.UnauthorizedException;
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
    public void create(final UserRequest.Create request) {
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
                        throw new IllegalStateException("Clã Global com código '" + GLOBAL_CLAN_JOIN_CODE
                                + "' não encontrado. O novo usuário não foi adicionado.");
                    });
        }
    }

    public UserDto findById(final long id) {
        return repository.findById(id)
                .map(converter::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Usuário com id " + id + " não encontrado."));
    }

    @Transactional
    public void updateProfile(final long id, final UserRequest.UpdateProfile request) {
        final User entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilizador com id " + id + " não encontrado."));

        entity.setName(request.getName());
        entity.setAvatarId(request.getAvatarId());

        repository.save(entity);
    }

    @Transactional
    public void updatePassword(final long id, final UserRequest.UpdatePassword request) throws UnauthorizedException {
        final User entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilizador com id " + id + " não encontrado."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), entity.getPassword())) {
            throw new UnauthorizedException("A palavra-passe atual está incorreta.");
        }

        entity.setPassword(passwordEncoder.encode(request.getNewPassword()));
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

    public long getScore(final long id, final long clanId) {
        return repository.findById(id)
                .map(user -> user.getAnswers().stream()
                .map(Answer::getOption)
                .filter(option -> option.isCorrect()
                && option.getQuestion().getUnit().getClan().getId() == clanId)
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

    /**
     * Gera o ranking de alunos de forma paginada. Se um clanId for fornecido, o
     * ranking é específico para aquele clã. Caso contrário, é um ranking
     * global.
     */
    public Page<UserWithScoreDto> getRanking(Pageable pageable, Long clanId) {
        List<User> studentsToRank;

        // 1. Determina a lista de alunos a serem classificados.
        if (clanId != null) {
            // Se um ID de clã for fornecido, busca os membros (integrants) daquele clã.
            Clan clan = clanRepository.findById(clanId)
                    .orElseThrow(() -> new EntityNotFoundException("Clã com id " + clanId + " não encontrado."));
            studentsToRank = clan.getIntegrants();
        } else {
            // Caso contrário, busca todos os utilizadores que são alunos.
            studentsToRank = repository.findByRole(Role.STUDENT);
        }

        // 2. Calcula a pontuação para cada aluno e ordena a lista completa.
        List<UserWithScoreDto> sortedRanking = studentsToRank.stream()
                .map(user -> {
                    // Usa o método de pontuação apropriado (global ou por clã).
                    long score = (clanId != null) ? getScore(user.getId(), clanId) : getScore(user.getId());
                    return new UserWithScoreDto(converter.toDto(user)).setScore(score);
                })
                .sorted((a, b) -> Long.compare(b.getScore(), a.getScore()))
                .toList();

        // 3. Pagina manualmente a lista ordenada.
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), sortedRanking.size());

        List<UserWithScoreDto> pageContent = sortedRanking.isEmpty() ? Collections.emptyList() : sortedRanking.subList(start, end);

        // 4. Retorna um objeto Page.
        return new PageImpl<>(pageContent, pageable, sortedRanking.size());
    }
}
