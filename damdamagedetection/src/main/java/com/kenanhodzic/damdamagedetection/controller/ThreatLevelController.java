package com.kenanhodzic.damdamagedetection.controller;

import com.kenanhodzic.damdamagedetection.dto.ThreatLevel;
import com.kenanhodzic.damdamagedetection.service.ThreatLevelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping(value = {"${api.v1.prefix}/threat-level"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class ThreatLevelController {
    private final ThreatLevelService service;

    public ThreatLevelController(final ThreatLevelService service){
        this.service = service;
    }

    @GetMapping("/list")
    public ResponseEntity<List<ThreatLevel>> getAll() {
        final List<ThreatLevel> models = service.getAll();
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThreatLevel> getById(@PathVariable final Integer id) {
        final Optional<ThreatLevel> model = service.getById(id);
        return model.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/create")
    public ResponseEntity<ThreatLevel> save(@RequestBody final ThreatLevel model) {
        final ThreatLevel savedModel = service.save(model);
        return new ResponseEntity<>(savedModel, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ThreatLevel> update(@PathVariable final Integer id, @RequestBody final ThreatLevel model) {
        final Optional<ThreatLevel> updatedModel = service.update(id, model);
        return updatedModel.map(object -> new ResponseEntity<>(object, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable final Integer id) {
        final Optional<ThreatLevel> existingModel = service.getById(id);
        if (existingModel.isPresent()) {
            service.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
