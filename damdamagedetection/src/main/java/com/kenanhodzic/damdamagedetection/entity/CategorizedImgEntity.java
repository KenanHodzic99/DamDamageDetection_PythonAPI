package com.kenanhodzic.damdamagedetection.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "categorized_img")
public class CategorizedImgEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Integer id;

    @Column(name = "filename")
    private String filename;

    @Column(name = "img")
    private String img;

    @Column(name = "sector")
    private Integer sector;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "threat_level_id", referencedColumnName = "id")
    private ThreatLevelEntity threatLevel;

    @Column(name = "addressed")
    private Boolean addressed;
}
