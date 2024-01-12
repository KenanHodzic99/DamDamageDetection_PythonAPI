package com.kenanhodzic.damdamagedetection.service;

import com.kenanhodzic.damdamagedetection.dto.CategorizedImg;
import com.kenanhodzic.damdamagedetection.dto.ThreatLevel;
import com.kenanhodzic.damdamagedetection.entity.CategorizedImgEntity;
import com.kenanhodzic.damdamagedetection.repository.CategorizedImgRepository;
import com.kenanhodzic.damdamagedetection.repository.ThreatLevelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategorizedImgService {
    private final CategorizedImgRepository repository;
    private final ThreatLevelRepository threatLevelRepository;

    public CategorizedImgService(final CategorizedImgRepository repository, final ThreatLevelRepository threatLevelRepository){
        this.repository = repository;
        this.threatLevelRepository = threatLevelRepository;
    }

    public List<CategorizedImg> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public Optional<CategorizedImg> getById(final Integer id) {
        return repository.findById(id).map(this::toDto);
    }

    @Transactional
    public Optional<CategorizedImg> update(final Integer id, final CategorizedImg model) {
        if (model.getId() != null && !model.getId().equals(id)) {
            throw new IllegalArgumentException("Id in path and body do not match");
        }

        final Optional<CategorizedImgEntity> existingEntity = repository.findById(id);
        return existingEntity.map(e -> toDto(repository.save(updateExistingEntityWithDto(model, e))));
    }

    @Transactional
    public CategorizedImg save(final CategorizedImg model) {
        return toDto(repository.save(toEntity(model)));
    }

    @Transactional
    public void deleteById(final Integer id) {
        repository.deleteById(id);
    }

    public CategorizedImgEntity updateExistingEntityWithDto(final CategorizedImg model, final CategorizedImgEntity entity){
        entity.setAddressed(model.getAddressed());
        entity.setFilename(model.getFilename());
        entity.setImg(model.getImg());
        entity.setSector(model.getSector());
        entity.setThreatLevel(model.getThreatLevel() != null ? threatLevelRepository.getReferenceById(model.getThreatLevel().getId()) : null);
        return entity;
    }

    public CategorizedImg toDto(CategorizedImgEntity entity){
        return CategorizedImg.builder()
                .id(entity.getId())
                .threatLevel( entity.getThreatLevel() != null ? ThreatLevel.builder()
                        .id(entity.getThreatLevel().getId())
                        .name(entity.getThreatLevel().getName())
                        .build() : null)
                .addressed(entity.getAddressed())
                .sector(entity.getSector())
                .img(entity.getImg())
                .filename(entity.getFilename())
                .build();
    }

    public CategorizedImgEntity toEntity(CategorizedImg dto){
        return CategorizedImgEntity.builder()
                .id(dto.getId())
                .filename(dto.getFilename())
                .addressed(dto.getAddressed())
                .img(dto.getImg())
                .sector(dto.getSector())
                .threatLevel(dto.getThreatLevel() != null ? threatLevelRepository.getReferenceById(dto.getThreatLevel().getId()) : null)
                .build();
    }
}
