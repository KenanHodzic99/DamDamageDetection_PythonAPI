package com.kenanhodzic.damdamagedetection.service;

import com.kenanhodzic.damdamagedetection.dto.Model;
import com.kenanhodzic.damdamagedetection.entity.ModelEntity;
import com.kenanhodzic.damdamagedetection.repository.ModelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ModelService {
    private final ModelRepository repository;

    public ModelService(final ModelRepository repository){
        this.repository = repository;
    }

    public List<Model> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public Optional<Model> getById(final Integer id) {
        return repository.findById(id).map(this::toDto);
    }

    @Transactional
    public Optional<Model> update(final Integer id, final Model model) {
        if (model.getId() != null && !model.getId().equals(id)) {
            throw new IllegalArgumentException("Id in path and body do not match");
        }

        final Optional<ModelEntity> existingEntity = repository.findById(id);
        return existingEntity.map(e -> toDto(repository.save(updateExistingEntityWithDto(model, e))));
    }

    @Transactional
    public Model save(final Model model) {
        return toDto(repository.save(toEntity(model)));
    }

    @Transactional
    public void deleteById(final Integer id) {
        repository.deleteById(id);
    }

    public ModelEntity updateExistingEntityWithDto(final Model model, final ModelEntity entity){
        entity.setFilename(model.getFilename());
        entity.setAccuracy(model.getAccuracy());
        entity.setCreated(model.getCreated());
        entity.setGraph(model.getGraph());
        return entity;
    }

    public Model toDto(ModelEntity entity){
        return Model.builder()
                .id(entity.getId())
                .filename(entity.getFilename())
                .graph(entity.getGraph())
                .accuracy(entity.getAccuracy())
                .created(entity.getCreated())
                .build();
    }

    public ModelEntity toEntity(Model dto){
        return ModelEntity.builder()
                .id(dto.getId())
                .filename(dto.getFilename())
                .graph(dto.getGraph())
                .accuracy(dto.getAccuracy())
                .created(dto.getCreated())
                .build();
    }
}
