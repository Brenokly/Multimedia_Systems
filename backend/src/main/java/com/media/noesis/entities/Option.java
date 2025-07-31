package com.media.noesis.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "options", uniqueConstraints = @UniqueConstraint(columnNames = { "question", "assertion" }))
public class Option {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(optional = false)
    private Question question;

    @Column(nullable = false)
    private boolean correct;

    @Column(nullable = false)
    private String assertion;

    @Column
    private String feedback;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "option")
    private List<Answer> answers;

}
