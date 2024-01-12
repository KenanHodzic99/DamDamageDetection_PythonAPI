package com.kenanhodzic.damdamagedetection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Scan {
    private Integer id;
    private LocalDateTime date;
    private Model model;
    private Integer scanned;
    private Integer cracked;
    private Integer nonCracked;
}
