package com.kenanhodzic.damdamagedetection.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RequestMapping(value = "${api.v1.prefix}/me")
@RestController
public class CurrentUserController {
    @GetMapping(value = "/name")
    public String getName(final Authentication authentication) {
        if (authentication == null) {
            return "Anonymous";
        } else {
            return authentication.getName();
        }
    }

    @GetMapping(value = "/role")
    public List<String> getRole(final Authentication authentication) {
        if (authentication == null) {
            return List.of("ROLE_ADMIN");
        } else {
            return ((UserDetails) authentication.getPrincipal()).getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        }
    }
}
