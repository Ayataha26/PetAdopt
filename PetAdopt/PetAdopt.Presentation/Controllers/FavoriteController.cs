using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BusinessLogic.Services.Interfaces;
using System.Security.Claims;

namespace PetAdopt.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Adopter")]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        // ✅ جلب المفضلة
        [HttpGet]
        public async Task<IActionResult> GetMyFavorites()
        {
            try
            {
                var userId = GetUserId();
                var result = await _favoriteService.GetMyFavoritesAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ إضافة للمفضلة
        [HttpPost("{petId}")]
        public async Task<IActionResult> AddToFavorites(int petId)
        {
            try
            {
                var userId = GetUserId();
                await _favoriteService.AddToFavoritesAsync(userId, petId);
                return Ok(new { message = "Added to favorites" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ إزالة من المفضلة
        [HttpDelete("{petId}")]
        public async Task<IActionResult> RemoveFromFavorites(int petId)
        {
            try
            {
                var userId = GetUserId();
                await _favoriteService.RemoveFromFavoritesAsync(userId, petId);
                return Ok(new { message = "Removed from favorites" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ هل الـ Pet في المفضلة؟
        [HttpGet("is-favorite/{petId}")]
        public async Task<IActionResult> IsFavorite(int petId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _favoriteService.IsFavoriteAsync(userId, petId);
                return Ok(new { isFavorite = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }
    }
}