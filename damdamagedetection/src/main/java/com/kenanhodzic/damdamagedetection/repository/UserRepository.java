package com.kenanhodzic.damdamagedetection.repository;

import com.kenanhodzic.damdamagedetection.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserRepository extends JpaRepository<UserEntity, Integer>, JpaSpecificationExecutor<UserEntity> {
	UserEntity findByUsername(String username);
}
