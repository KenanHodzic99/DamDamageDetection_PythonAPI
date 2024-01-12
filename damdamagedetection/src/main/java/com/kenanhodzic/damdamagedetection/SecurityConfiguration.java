package com.kenanhodzic.damdamagedetection;

import com.kenanhodzic.damdamagedetection.repository.UserRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;
import java.util.Map;

import static com.kenanhodzic.damdamagedetection.security.ApplicationUserRole.ADMIN;
import static com.kenanhodzic.damdamagedetection.security.ApplicationUserRole.USER;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration {
    public static final String ID_FOR_ENCODE = "bcrypt";
    public static final String PBKDF_2 = "pbkdf2";
    public static final String SCRYPT = "scrypt";

    @Value("${api.v1.prefix}")
    private static final String apiPrefix = "/api";

    @Bean
    @Qualifier("userDetailsService")
    @Profile("db-auth")
    public com.kenanhodzic.damdamagedetection.security.UserDetailsService dcuserDetailsService(final UserRepository userRepository) {
        return new com.kenanhodzic.damdamagedetection.security.UserDetailsService(userRepository);
    }

    @Bean
    public CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
        return CookieSameSiteSupplier.ofStrict();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        final Map<String, PasswordEncoder> encoders = Map.of(
                ID_FOR_ENCODE, new BCryptPasswordEncoder(),
                PBKDF_2, Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8(),
                SCRYPT, SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8()
        );

        return new DelegatingPasswordEncoder(ID_FOR_ENCODE, encoders);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(requests -> requests
                        .requestMatchers(HttpMethod.OPTIONS).permitAll()
                        .requestMatchers("/css/**").permitAll()
                        .requestMatchers("/download/**").hasAnyRole(ADMIN.name())
                        .requestMatchers("/model/**").hasAnyRole(ADMIN.name())
                        .requestMatchers("/**").hasAnyRole(USER.name(), ADMIN.name())
                        .anyRequest().permitAll()
                ).httpBasic(Customizer.withDefaults())
                .formLogin(form -> form.loginPage("/login").permitAll())
                .logout(LogoutConfigurer::permitAll);
        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(final @Qualifier("userDetailsService") UserDetailsService userDetailsService, final PasswordEncoder passwordEncoder) {
        final DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder);
        return daoAuthenticationProvider;
    }

    @Bean
    @Qualifier("userDetailsService")
    @Profile("!db-auth")
    public InMemoryUserDetailsManager inmMemoryUserDetailsService(final PasswordEncoder passwordEncoder, final @Value("${users:}") List<String> userStrings) {
        final List<UserDetails> users = userStrings.stream().map(s -> {
            final String[] split = s.split(":");
            return User.withUsername(split[0])
                    .password(passwordEncoder.encode(split[1]))
                    .roles(split.length > 2 ? split[2] : "ADMIN")
                    .accountLocked(false)
                    .disabled(false)
                    .accountExpired(false)
                    .build();
        }).toList();

        return new InMemoryUserDetailsManager(users);
    }

    @Bean
    @ConditionalOnMissingBean
    public WebSecurityCustomizer securityCustomizer() {
        return web -> web.ignoring().requestMatchers("/static/**", "/*.png");
    }

    @Bean
    @Profile(value = {"no-security"})
    public WebSecurityCustomizer noSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers("/**");
    }

}
