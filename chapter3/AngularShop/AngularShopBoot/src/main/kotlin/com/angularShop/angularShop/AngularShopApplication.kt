package com.angularShop.angularShop

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories("com.angularShop.angularShop.repositories")
class AngularShopApplication

fun main(args: Array<String>) {
	runApplication<AngularShopApplication>(*args)
}
