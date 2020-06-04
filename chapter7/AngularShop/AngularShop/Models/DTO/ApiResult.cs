using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;
using System.Threading.Tasks;

namespace AngularShop.Models.DTO
{
    public class ApiResult<T>
    {
        /// <summary>
        /// 조회 결과 데이터
        /// </summary>
        public List<T> Data { get; private set; }
        /// <summary>
        /// 페이지 번호
        /// </summary>
        public int PageIndex { get; private set; }
        /// <summary>
        /// 한 페이지의 항목 개수
        /// </summary>
        public int PageSize { get; private set; }
        /// <summary>
        /// 전체 항목 개수
        /// </summary>
        public int TotalCount { get; private set; }
        /// <summary>
        /// 전체 페이지 개수
        /// </summary>
        public int TotalPages { get; private set; }

        private ApiResult(
            List<T> data,
            int count,
            int pageIndex,
            int pageSize)
        {
            Data = data;
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalCount = count;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        }

        /// <summary>
        /// 페이징 데이터 생성
        /// </summary>
        /// <param name="source">데이터 소스</param>
        /// <param name="pageIndex">페이지 번호(0 = 첫 페이지)</param>
        /// <param name="pageSize">페이지 크기</param>
        /// <param name="sortColumn">정렬할 컬럼 명</param>
        /// <param name="sortOrder">정렬 순서("ASC", "DESC")</param>
        /// <param name="filterColumn">검색 컬럼 명</param>
        /// <param name="filterQuery">검색 값</param>
        /// <returns></returns>
        public static async Task<ApiResult<T>> CreateAsync(
            IQueryable<T> source,
            int pageIndex,
            int pageSize,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {            
            if (!string.IsNullOrEmpty(filterColumn)
                && !string.IsNullOrEmpty(filterQuery)
                && IsValidProperty(filterColumn))
            {
                //모델에 포함된 속성에 대한 검색이라면
                source = source.Where(
                    $"{filterColumn}.Contains(@0)",
                    filterQuery);
            }

            var count = await source.CountAsync();

            if (!string.IsNullOrEmpty(sortColumn) &&
                IsValidProperty(sortColumn))
            {
                //모델에 포함된 속성에 대한 정렬이라면
                sortOrder = !string.IsNullOrEmpty(sortOrder)
                    && sortOrder.ToUpper() == "ASC"
                    ? "ASC"
                    : "DESC";

                //제너릭한 타입인 T에 대해서 정렬할 컬럼을 미리 알 수 없으므로
                //System.Linq.Dynamic.Core를 통해 동적 쿼리를 작성함.
                //이런방식은 SQL Injection에 취약할 수 있으나
                //이 코드의 경우 sortOrder와 sortColumn의 값을 제한하거나 확인을 거치므로 괜찬음.
                source = source.OrderBy($"{sortColumn} {sortOrder}");
            }

            source = source
                .Skip(pageIndex * pageSize)
                .Take(pageSize);

            var data = await source.ToListAsync();

            return new ApiResult<T>(
                data,
                count,
                pageIndex,
                pageSize);
        }

        /// <summary>
        /// 모델 클래스에 포함된 속성인지 검사
        /// </summary>
        /// <param name="propertyName">검사할 속성 이름</param>
        /// <param name="throwExceptionIfNotFound">속성이 없을때 예외 발생</param>
        /// <returns></returns>
        public static bool IsValidProperty(
            string propertyName,
            bool throwExceptionIfNotFound = true)
        {
            var prop = typeof(T).GetProperty(
                propertyName,
                BindingFlags.IgnoreCase |
                BindingFlags.Public |
                BindingFlags.Instance);
            if (prop == null && throwExceptionIfNotFound)
            {
                throw new NotSupportedException(
                    $"ERROR: Property '{propertyName}' does not exist.");
            }

            return prop != null;
        }

        /// <summary>
        /// 중복되는 값이 있는지 검사
        /// </summary>
        /// <param name="source">중복을 검사할 데이터 소스</param>
        /// <param name="id">중복 검사에서 제외할 id</param>
        /// <param name="fieldName">중복 검사 필드 이름</param>
        /// <param name="fieldValue">중복 검사 값</param>
        /// <returns></returns>
        public static bool IsDupeField(
            IQueryable<T> source,
            long id,
            string fieldName,
            string fieldValue)
        {
            return ApiResult<T>.IsValidProperty(fieldName, true)
                ? source.Any($"{fieldName} == @0 && Id != @1", fieldValue, id)
                : false;
        }
    }
}
