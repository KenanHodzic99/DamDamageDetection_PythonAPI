package com.kenanhodzic.damdamagedetection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CategorizedImg {
    private Integer id;
    private String filename;
    private ThreatLevel threatLevel;
    private Boolean addressed;
    private String img;
    private Integer sector;
}
