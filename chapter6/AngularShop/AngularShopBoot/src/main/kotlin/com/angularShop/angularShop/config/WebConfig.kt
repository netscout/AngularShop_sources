package com.angularShop.angularShop.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///c:/Sources/AngularShop/images/")
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("/resources/")
    }
}