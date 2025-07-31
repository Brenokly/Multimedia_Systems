package com.media.noesis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.media.noesis.entities.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {

}
