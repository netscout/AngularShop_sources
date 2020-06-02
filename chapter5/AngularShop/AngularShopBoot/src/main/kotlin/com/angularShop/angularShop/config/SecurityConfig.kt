package com.angularShop.angularShop.config

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

@Configuration
@EnableWebSecurity
class SecurityConfig(
) : WebSecurityConfigurerAdapter() {
    override fun configure(web: WebSecurity) {
        //정적 컨텐츠는 인증 없이 접근 가능하도록 설정
        web.ignoring().antMatchers("/resources/**").anyRequest()
    }

    override fun configure(http: HttpSecurity) {
        http
                .csrf().disable()
                .authorizeRequests()
                //일단 모든 요청을 허용하도록 설정
                .anyRequest().permitAll()
    }
}