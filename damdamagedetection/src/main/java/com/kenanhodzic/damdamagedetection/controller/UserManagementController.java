package com.kenanhodzic.damdamagedetection.controller;

import com.kenanhodzic.damdamagedetection.entity.UserEntity;
import com.kenanhodzic.damdamagedetection.security.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("${api.v1.prefix}/users")
public class UserManagementController {
    private final UserManagementService useruserManagementService;

    @Autowired
    public UserManagementController(final UserManagementService useruserManagementService) {
        this.useruserManagementService = useruserManagementService;
    }

    @GetMapping(value = "")
    public List<UserEntity> getAll() {
        return useruserManagementService.findAll();
    }


    @PostMapping(value = "")
    public UserEntity save(final @RequestBody UserEntity entity) {
        try {
            return useruserManagementService.addUser(entity);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @PutMapping(value = "/{id}")
    public UserEntity save(final @PathVariable Long id, final @RequestBody UserEntity entity, final Authentication authentication) {
        try {
            return useruserManagementService.updateUser(id, entity);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @DeleteMapping(value = "/{id}")
    public void save(final @PathVariable int id, final Authentication authentication) {
        try {
             useruserManagementService.removeUser(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}
