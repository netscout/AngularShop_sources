package com.angularShop.angularShop.config

import com.angularShop.angularShop.config.identity.JwtConfig
import com.angularShop.angularShop.config.identity.JwtTokenFilter
import com.angularShop.angularShop.config.identity.JwtTokenProvider
import com.angularShop.angularShop.config.identity.SecureTokenFilter
import com.angularShop.angularShop.services.identity.CustomUserDetailsService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig(
        @Autowired private val userDetailsService: CustomUserDetailsService,
        @Autowired private val bCryptPasswordEncoder: BCryptPasswordEncoder,
        @Autowired private val jwtTokenProvider: JwtTokenProvider
) : WebSecurityConfigurerAdapter() {
    @Bean
    override fun authenticationManagerBean(): AuthenticationManager {
        return super.authenticationManagerBean()
    }

    override fun configure(web: WebSecurity) {
        //정적 컨텐츠는 인증 없이 접근 가능하도록 설정
        web.ignoring()
                .antMatchers("/images/**")
                .antMatchers("/styles/**")
                .antMatchers("/js/**")
                .antMatchers("/plugins/**")
    }

    override fun configure(http: HttpSecurity) {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/Products/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/Account/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/Token/**").permitAll()
                .antMatchers(HttpMethod.DELETE, "/api/Token/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/Seed/**").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
                .apply(JwtConfig(jwtTokenProvider))
    }

    override fun configure(auth: AuthenticationManagerBuilder) {
        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCryptPasswordEncoder)
    }
}