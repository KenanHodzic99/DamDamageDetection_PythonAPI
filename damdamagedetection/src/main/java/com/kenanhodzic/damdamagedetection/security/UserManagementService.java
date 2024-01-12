package com.kenanhodzic.damdamagedetection.security;

import com.kenanhodzic.damdamagedetection.entity.UserEntity;
import com.kenanhodzic.damdamagedetection.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserManagementService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final Optional<PasswordValidator> passwordValidator;
	private final AuthenticationInContextProvider authenticationInContextProvider;

	@Autowired
	public UserManagementService(final UserRepository userRepository, final PasswordEncoder passwordEncoder, final Optional<PasswordValidator> passwordValidator, final AuthenticationInContextProvider authenticationInContextProvider) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.passwordValidator = passwordValidator;
		this.authenticationInContextProvider = authenticationInContextProvider;
	}

	private UserEntity save(final UserEntity entity) {
		if (entity == null) {
			return null;
		}
		if (entity.getId() == null) {
			entity.setId(0);
		}
		final Optional<UserEntity> currentUserEntity = userRepository.findById(entity.getId());
		if (entity.getId() > 0 && entity.getPassword() == null) {
			final var password = currentUserEntity
					.map(UserEntity::getPassword)
					.orElseThrow(() -> new IllegalArgumentException("User pretends to exist but does not."));
			entity.setPassword(password);
		} else {
			if (passwordValidator.isEmpty() || passwordValidator.get().isValid(entity.getPassword())) {
				entity.setPassword(passwordEncoder.encode(entity.getPassword()));
			} else {
				throw new IllegalArgumentException(
						"The Password is violating the rules for safe passwords: Either it is < 8 characters or a common password.");
			}
		}
		addAppAdminIfChangingUserIsNotAbleToChangeAppAdminRole(entity, currentUserEntity);
		return userRepository.save(entity);
	}

	private void addAppAdminIfChangingUserIsNotAbleToChangeAppAdminRole(final UserEntity entity, final Optional<UserEntity> currentUserEntity) {
		if (!authenticationInContextProvider.isAppAdmin() && currentUserEntity.isPresent() && currentUserEntity.get().getRolesList().contains(ApplicationUserRole.ADMIN.name())) {
			entity.addRoles(ApplicationUserRole.ADMIN.name());
		}
	}

	public UserEntity addUser(final UserEntity entity) {
		return save(entity);
	}

	public UserEntity updateUser(final Long id, final UserEntity entity) {
		if (entity.getId() == null || entity.getId() == 0) {
			entity.setId(id.intValue());
		} else if (!Objects.equals(id, entity.getId())) {
			throw new IllegalStateException("Given id and id of user entity do not match.");
		}
		return save(entity);
	}

	public void removeUser(final int id){
		userRepository.deleteById(id);
	}

	public List<UserEntity> findAll() {
		return userRepository.findAll();
	}
}
