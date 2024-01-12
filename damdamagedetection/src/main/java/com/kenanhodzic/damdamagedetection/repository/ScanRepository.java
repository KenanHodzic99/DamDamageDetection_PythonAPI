package com.kenanhodzic.damdamagedetection.repository;

import com.kenanhodzic.damdamagedetection.entity.ScanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScanRepository extends JpaRepository<ScanEntity, Integer> {
    public List<ScanEntity> findAllByModel_Id(int modelId);
}
