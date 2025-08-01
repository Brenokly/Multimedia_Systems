package com.media.noesis.entities;

import java.util.List;

import com.media.noesis.enums.Level;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(optional = false)
    private User author;

    @ManyToOne(optional = false)
    private Unit unit;

    @Column
    @Enumerated(EnumType.STRING)
    private Level level;

    @Column(nullable = false)
    private String statement;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "question")
    private List<Option> options;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "questions_topics", joinColumns = @JoinColumn(name = "question"), inverseJoinColumns = @JoinColumn(name = "topic"), uniqueConstraints = @UniqueConstraint(columnNames = {
            "question", "topic" }))
    private List<Topic> topics;

}
