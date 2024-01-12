package com.kenanhodzic.damdamagedetection.repository;

import com.kenanhodzic.damdamagedetection.entity.ThreatLevelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThreatLevelRepository extends JpaRepository<ThreatLevelEntity, Integer> {
}
