package com.kenanhodzic.damdamagedetection.service;

import com.kenanhodzic.damdamagedetection.dto.Model;
import com.kenanhodzic.damdamagedetection.dto.Scan;
import com.kenanhodzic.damdamagedetection.entity.ScanEntity;
import com.kenanhodzic.damdamagedetection.repository.ModelRepository;
import com.kenanhodzic.damdamagedetection.repository.ScanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ScanService {
    private final ScanRepository repository;
    private final ModelRepository modelRepository;

    public ScanService(final ScanRepository repository, final ModelRepository modelRepository){
        this.repository = repository;
        this.modelRepository = modelRepository;
    }

    public List<Scan> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public List<Scan> getAllByModelId(final Integer modelId) {
        return repository.findAllByModel_Id(modelId.intValue()).stream().map(this::toDto).toList();
    }

    public Optional<Scan> getById(final Integer id) {
        return repository.findById(id).map(this::toDto);
    }

    @Transactional
    public Optional<Scan> update(final Integer id, final Scan model) {
        if (model.getId() != null && !model.getId().equals(id)) {
            throw new IllegalArgumentException("Id in path and body do not match");
        }

        final Optional<ScanEntity> existingEntity = repository.findById(id);
        return existingEntity.map(e -> toDto(repository.save(updateExistingEntityWithDto(model, e))));
    }

    public ScanEntity updateExistingEntityWithDto(final Scan model, final ScanEntity entity){
        entity.setScanned(model.getScanned());
        entity.setDate(model.getDate());
        entity.setModel(modelRepository.getReferenceById(model.getModel().getId()));
        entity.setCracked(model.getCracked());
        entity.setNonCracked(model.getNonCracked());
        return entity;
    }

    @Transactional
    public Scan save(final Scan model) {
        return toDto(repository.save(toEntity(model)));
    }

    @Transactional
    public void deleteById(final Integer id) {
        repository.deleteById(id);
    }

    public Scan toDto(ScanEntity entity){
        return Scan.builder()
                .id(entity.getId())
                .model(Model.builder()
                        .id(entity.getModel().getId())
                        .filename(entity.getModel().getFilename())
                        .accuracy(entity.getModel().getAccuracy())
                        .created(entity.getModel().getCreated())
                        .build())
                .date(entity.getDate())
                .scanned(entity.getScanned())
                .cracked(entity.getCracked())
                .nonCracked(entity.getNonCracked())
                .build();
    }

    public ScanEntity toEntity(Scan dto){
        return ScanEntity.builder()
                .id(dto.getId())
                .model(modelRepository.getReferenceById(dto.getModel().getId()))
                .date(dto.getDate())
                .scanned(dto.getScanned())
                .cracked(dto.getCracked())
                .nonCracked(dto.getNonCracked())
                .build();
    }
}
