package com.kenanhodzic.damdamagedetection.service;

import com.kenanhodzic.damdamagedetection.dto.ThreatLevel;
import com.kenanhodzic.damdamagedetection.entity.ThreatLevelEntity;
import com.kenanhodzic.damdamagedetection.repository.ThreatLevelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ThreatLevelService {
    private final ThreatLevelRepository repository;

    public ThreatLevelService(final ThreatLevelRepository repository){
        this.repository = repository;
    }

    public List<ThreatLevel> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public Optional<ThreatLevel> getById(final Integer id) {
        return repository.findById(id).map(this::toDto);
    }

    @Transactional
    public Optional<ThreatLevel> update(final Integer id, final ThreatLevel model) {
        if (model.getId() != null && !model.getId().equals(id)) {
            throw new IllegalArgumentException("Id in path and body do not match");
        }

        final Optional<ThreatLevelEntity> existingEntity = repository.findById(id);
        return existingEntity.map(e -> toDto(repository.save(updateExistingEntityWithDto(model, e))));
    }

    @Transactional
    public ThreatLevel save(final ThreatLevel model) {
        return toDto(repository.save(toEntity(model)));
    }

    @Transactional
    public void deleteById(final Integer id) {
        repository.deleteById(id);
    }

    public ThreatLevelEntity updateExistingEntityWithDto(final ThreatLevel model, final ThreatLevelEntity entity){
        entity.setName(model.getName());
        return entity;
    }

    public ThreatLevel toDto(ThreatLevelEntity entity){
        return ThreatLevel.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    public ThreatLevelEntity toEntity(ThreatLevel dto){
        return ThreatLevelEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .build();
    }
}
