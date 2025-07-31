package com.media.noesis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.media.noesis.entities.Unit;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {

}
