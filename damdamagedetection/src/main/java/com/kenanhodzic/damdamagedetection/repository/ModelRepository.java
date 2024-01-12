package com.kenanhodzic.damdamagedetection.repository;

import com.kenanhodzic.damdamagedetection.entity.ModelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModelRepository extends JpaRepository<ModelEntity, Integer> {
}
