package com.kenanhodzic.damdamagedetection.controller;

import com.kenanhodzic.damdamagedetection.dto.CategorizedImg;
import com.kenanhodzic.damdamagedetection.service.CategorizedImgService;
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
@RequestMapping(value = {"${api.v1.prefix}/categorized-img"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class CategorizedImgController {
    private final CategorizedImgService service;

    public CategorizedImgController(final CategorizedImgService service){
        this.service = service;
    }

    @GetMapping("/list")
    public ResponseEntity<List<CategorizedImg>> getAll() {
        final List<CategorizedImg> models = service.getAll();
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategorizedImg> getById(@PathVariable final Integer id) {
        final Optional<CategorizedImg> model = service.getById(id);
        return model.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/create")
    public ResponseEntity<CategorizedImg> save(@RequestBody final CategorizedImg model) {
        final CategorizedImg savedModel = service.save(model);
        return new ResponseEntity<>(savedModel, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CategorizedImg> update(@PathVariable final Integer id, @RequestBody final CategorizedImg model) {
        final Optional<CategorizedImg> updatedModel = service.update(id, model);
        return updatedModel.map(object -> new ResponseEntity<>(object, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable final Integer id) {
        final Optional<CategorizedImg> existingModel = service.getById(id);
        if (existingModel.isPresent()) {
            service.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
