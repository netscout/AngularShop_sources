package com.angularShop.angularShop.models.dto

data class ApiResult<T>(
        var data: List<T>,
        var pageIndex: Int,
        var pageSize: Int,
        var totalCount: Long,
        var totalPages: Int
)