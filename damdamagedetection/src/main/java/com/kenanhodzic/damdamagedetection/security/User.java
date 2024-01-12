package com.kenanhodzic.damdamagedetection.security;

import com.kenanhodzic.damdamagedetection.entity.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

public class User implements UserDetails {

	@Serial
	private static final long serialVersionUID = 6297841800672498031L;

	private final UserEntity user;

	public User(final UserEntity user) {
		this.user = user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		if (null != user.getRoles() && !user.getRoles().isEmpty()) {
			return Arrays.stream(user.getRoles().split(",")).map(role -> new SimpleGrantedAuthority("ROLE_" + role)).toList();
		}
		return new ArrayList<>();
	}

	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUsername();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
