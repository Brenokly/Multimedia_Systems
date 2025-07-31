package com.media.noesis.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.media.noesis.entities.Question;
import com.media.noesis.enums.Level;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByLevel(Level level);

    Optional<Question> findByStatement(String statement);

    List<Question> findByAuthorId(long authorId);

}
