package com.kenanhodzic.damdamagedetection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Model {
    private Integer id;
    private String filename;
    private Date created;
    private String accuracy;
    private String graph;
}
