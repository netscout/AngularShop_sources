using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AngularShop.Data;
using AngularShop.Models;
using AngularShop.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using AngularShop.Extensions;

namespace AngularShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [Authorize(Roles = Constants.DefaultAdminRole)]
        [HttpGet]
        public async Task<ActionResult<ApiResult<Order>>> GetOrders(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            return await ApiResult<Order>.CreateAsync(
                _context.Orders
                    .AsNoTracking()
                    .Select(o => new Order
                    {
                        Id = o.Id,
                        ToName = o.ToName,
                        Address1 = o.Address1,
                        Address2 = o.Address2,
                        Phone = o.Phone,
                        TotalPrice = o.TotalPrice,
                        OrderItems = 
                            _context.OrderItems
                                .Where(oi => oi.OrderId == o.Id)
                                .ToList(),
                        OrderStatusId = o.OrderStatusId,
                        UserId = o.User.Id,
                        UserName = o.User.UserName,
                        CreatedDate = o.CreatedDate
                    }),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET: api/Orders/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(long id)
        {
            var order = await _context.Orders
                .AsNoTracking()
                .Select(o => new Order
                {
                    Id = o.Id,
                    ToName = o.ToName,
                    Address1 = o.Address1,
                    Address2 = o.Address2,
                    Phone = o.Phone,
                    TotalPrice = o.TotalPrice,
                    OrderItems = o.OrderItems.Select(oi => new OrderItem
                    {
                        ProductId = oi.Product.Id,
                        ProductName = oi.Product.Name,
                        Price = oi.Price,
                        Qty = oi.Qty
                    }).ToList(),
                    OrderStatus = o.OrderStatus,
                    UserId = o.User.Id,
                    UserName = o.User.UserName,
                    CreatedDate = o.CreatedDate
                })
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        [Authorize(Roles = Constants.DefaultAdminRole)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(long id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;
            //CreatedDate는 수정되지 않도록 설정
            _context.Entry(order)
                .Property(p => p.CreatedDate).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Orders
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(OrderDTO req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var order = new Order
            {
                UserId = HttpContext.Request.CurrentUserId(),
                ToName = req.ToName,
                Address1 = req.Address1,
                Address2 = req.Address2,
                Phone = req.Phone
            };

            _context.Orders.Add(order);

            decimal totalPrice = 0;

            foreach (var oi in req.OrderItems)
            {
                var p = await _context.Products
                    .FirstOrDefaultAsync(p => p.Id == oi.ProductId);

                //제품이 없거나, 제품의 재고가 없다면
                if (p == null || oi.Qty > p.StockCount)
                {
                    return BadRequest();
                }

                //할인 가격
                var discountAmount = p.Price * p.Discount.Value / 100m;

                //할인된 가격을 구한 후 둘째 자리 까지 계산
                var price = Math.Truncate((p.Price - discountAmount) * 100m) 
                    / 100m;
                price *= oi.Qty;
                //재고 감소
                p.StockCount -= oi.Qty;

                totalPrice += price;

                var orderItem = new OrderItem
                {
                    ProductId = p.Id,
                    Price = price,
                    Order = order,
                    Qty = oi.Qty
                };

                _context.OrderItems.Add(orderItem);
            }

            order.TotalPrice = totalPrice;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                OrderId = order.Id
            });
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Order>> DeleteOrder(long id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return order;
        }

        private bool OrderExists(long id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
