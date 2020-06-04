package com.angularShop.angularShop.config.identity

import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.GenericFilterBean
import java.lang.Exception
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest

class SecureTokenFilter(
) : GenericFilterBean() {
    override fun doFilter(
        request: ServletRequest?,
        response: ServletResponse?,
        chain: FilterChain?) {
        request ?: throw Exception()

        val req = (request as HttpServletRequest)
        val cookies = req.cookies

        cookies?.let{
            val tokenCookie = cookies.find { 
                c -> c.name == "kotlin_backend" }
            tokenCookie?.let {
                //토큰에 해당하는 쿠키를 찾았다면
                val mutableReq = MutableHttpServletRequest(req)
                mutableReq.putHeader(
                    "Authorization", 
                    "Bearer ${tokenCookie.value}")
                chain?.doFilter(request, response)
            } ?: run {
                //토큰에 대항하는 쿠키가 없다면,
                chain?.doFilter(request, response)
            }
        } ?: run {
            //쿠기가 하나도 없다면, 그냥 진행
            chain?.doFilter(request, response)
        }
    }
}