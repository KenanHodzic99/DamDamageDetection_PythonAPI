package com.kenanhodzic.damdamagedetection.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Integer id;
    @Column(nullable = false, unique = true)
    private String username;
    @Column(name = "firstname")
    private String firstname;
    @Column(name = "lastname")
    private String lastname;
    @Column(nullable = false, unique = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @Column(name = "roles")
    private String roles;

    @JsonGetter("roles")
    public String getDistinctRoles() {
        return String.join(",", getRolesList());
    }

    @JsonSetter("roles")
    public void setDistinctRoles(final String rolesToSet) {
        this.roles = "";
        addRoles(rolesToSet.split(","));
    }

    @JsonIgnore
    public List<String> getRolesList() {
        if (roles != null) {
            return Stream.of(roles.split(",")).distinct().toList();
        } else {
            return List.of();
        }
    }

    @JsonIgnore
    public void addRoles(final String... rolesToAdd) {
        if (roles == null) {
            roles = "";
        }

        final List<String> rolesList = new ArrayList<>(Arrays.asList(rolesToAdd));
        rolesList.addAll(Arrays.asList(roles.split(",")));
        roles = String.join(",", rolesList.stream().distinct().toList());
    }
}
