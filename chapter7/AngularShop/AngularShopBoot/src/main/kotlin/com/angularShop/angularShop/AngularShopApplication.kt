package com.angularShop.angularShop

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import java.util.*
import javax.annotation.PostConstruct

@EnableJpaAuditing
@SpringBootApplication
class AngularShopApplication() {
	@PostConstruct
	fun initApplication() {
		//항상 서버에서 시간을 UTC 기준으로 처리하도록 설정
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
	}
}

fun main(args: Array<String>) {
	runApplication<AngularShopApplication>(*args)
}
