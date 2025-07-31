package com.media.noesis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.media.noesis.entities.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

}
