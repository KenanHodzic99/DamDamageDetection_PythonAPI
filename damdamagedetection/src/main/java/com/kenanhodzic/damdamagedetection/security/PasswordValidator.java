package com.kenanhodzic.damdamagedetection.security;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;

@Component
@ConditionalOnProperty(prefix = "security", name = "validate.passwords", havingValue = "true", matchIfMissing = false)
public class PasswordValidator {

	public static final String BAD_PASSWORDS_CLASSPATH_RESOURCE = "/bad_passwords.txt";

	public boolean isValid(final String password) {
		try {
			return !(password == null || password.isBlank() || password.length() < 8 || isInListOfKnownBadPasswords(password));
		} catch (IOException | URISyntaxException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * Use of MIT licensed <a href="https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-10000.txt">https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-10000.txt</a>
	 */
	private boolean isInListOfKnownBadPasswords(final String password) throws IOException, URISyntaxException {
		try (InputStream in = this.getClass().getResourceAsStream(BAD_PASSWORDS_CLASSPATH_RESOURCE)) {
			return new BufferedReader(new InputStreamReader(in)).lines().anyMatch(password::equals);
		}
	}
}
