package com.kenanhodzic.damdamagedetection.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationInContextProvider {

	public Authentication getAuthentication() {
		return SecurityContextHolder.getContext().getAuthentication();
	}

	public boolean isAppAdmin() {
		final Authentication authentication = getAuthentication();
		if (authentication == null) {
			return true;
		} else {
			return authentication.getAuthorities().stream().anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_" + ApplicationUserRole.ADMIN.name()));
		}
	}
}
