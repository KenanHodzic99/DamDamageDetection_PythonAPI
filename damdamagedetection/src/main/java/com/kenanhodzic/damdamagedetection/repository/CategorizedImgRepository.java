package com.kenanhodzic.damdamagedetection.repository;

import com.kenanhodzic.damdamagedetection.entity.CategorizedImgEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorizedImgRepository extends JpaRepository<CategorizedImgEntity, Integer> {
}
