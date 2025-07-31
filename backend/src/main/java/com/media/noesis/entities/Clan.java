package com.media.noesis.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "clans")
public class Clan {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(optional = false)
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String joinCode;

    @ManyToMany
    @JoinTable(name = "clans_integrations", joinColumns = @JoinColumn(name = "clan"), inverseJoinColumns = @JoinColumn(name = "integrant"), uniqueConstraints = @UniqueConstraint(columnNames = {
            "clan", "integrant" }))
    private List<User> integrants;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "clan")
    private List<Unit> units;

}
