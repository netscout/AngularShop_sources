package com.angularShop.angularShop.config.identity

import java.util.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletRequestWrapper

internal class MutableHttpServletRequest(
    request: HttpServletRequest?
    ) : HttpServletRequestWrapper(request) {
    // 헤더와 헤더 값을 매핑
    private val customHeaders: MutableMap<String, String>

    fun putHeader(name: String, value: String) {
        customHeaders[name] = value
    }

    override fun getHeader(name: String): String {
        val headerValue = customHeaders[name]
        return headerValue 
            ?: (request as HttpServletRequest).getHeader(name)
    }

    override fun getHeaderNames(): Enumeration<String> {
        // 헤더로 부터 셋을 생성
        val set: MutableSet<String> = HashSet(customHeaders.keys)

        // 요청 객체에 헤더를 추가
        val e = (request as HttpServletRequest).headerNames
        while (e.hasMoreElements()) {
            val n = e.nextElement()
            set.add(n)
        }

        return Collections.enumeration(set)
    }

    init {
        customHeaders = HashMap()
    }
}