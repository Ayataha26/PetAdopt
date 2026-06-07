using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BusinessLogic.DTOs.Review;
using PetAdopt.BusinessLogic.Services.Interfaces;
using System.Security.Claims;

namespace PetAdopt.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // ✅ Adopter يكتب Review بعد التبني
        [HttpPost]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
        {
            try
            {
                var reviewerId = GetUserId();
                var result = await _reviewService.CreateReviewAsync(dto, reviewerId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ أي حد يشوف Reviews بتاعت Owner معين
        [HttpGet("owner/{ownerId}")]
        public async Task<IActionResult> GetOwnerReviews(int ownerId)
        {
            try
            {
                var result = await _reviewService.GetOwnerReviewsAsync(ownerId);
                return Ok(result);
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