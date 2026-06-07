using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BusinessLogic.Services.Interfaces;
using System.Security.Claims;

namespace PetAdopt.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdoptionController : ControllerBase
    {
        private readonly IAdoptionService _adoptionService;

        public AdoptionController(IAdoptionService adoptionService)
        {
            _adoptionService = adoptionService;
        }

        // ✅ Adopter يبعت طلب تبني
        [HttpPost("submit/{petId}")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> Submit(int petId)
        {
            try
            {
                var adopterId = GetUserId();
                var result = await _adoptionService.SubmitRequestAsync(petId, adopterId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ Owner يقبل الطلب
        [HttpPut("accept/{requestId}")]
        [Authorize(Roles = "Shelter")]
        public async Task<IActionResult> Accept(int requestId)
        {
            try
            {
                var ownerId = GetUserId();
                await _adoptionService.AcceptRequestAsync(requestId, ownerId);
                return Ok(new { message = "Adoption request accepted" });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ Owner يرفض الطلب
        [HttpPut("reject/{requestId}")]
        [Authorize(Roles = "Shelter")]
        public async Task<IActionResult> Reject(int requestId)
        {
            try
            {
                var ownerId = GetUserId();
                await _adoptionService.RejectRequestAsync(requestId, ownerId);
                return Ok(new { message = "Adoption request rejected" });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ Adopter يشوف طلباته
        [HttpGet("my-requests")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> GetMyRequests()
        {
            try
            {
                var adopterId = GetUserId();
                var result = await _adoptionService.GetMyRequestsAsync(adopterId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ Owner يشوف الطلبات على الـ Pets بتاعته
        [HttpGet("requests-for-my-pets")]
        [Authorize(Roles = "Shelter")]
        public async Task<IActionResult> GetRequestsForMyPets()
        {
            try
            {
                var ownerId = GetUserId();
                var result = await _adoptionService.GetRequestsForMyPetsAsync(ownerId);
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