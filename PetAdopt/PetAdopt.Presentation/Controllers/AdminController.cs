using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BusinessLogic.Services.Interfaces;

namespace PetAdopt.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // ✅ جلب المستخدمين الـ Pending
        [HttpGet("pending-users")]
        public async Task<IActionResult> GetPendingUsers()
        {
            try
            {
                var users = await _adminService.GetPendingUsersAsync();
                var safeUsers = users.Select(u => new {
                    id = u.Id,
                    fullName = u.FullName,
                    email = u.Email,
                    role = u.Role,
                    status = u.Status,
                    createdAt = u.CreatedAt
                });
                return Ok(safeUsers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ قبول مستخدم
        [HttpPut("approve-user/{userId}")]
        public async Task<IActionResult> ApproveUser(int userId)
        {
            try
            {
                await _adminService.ApproveUserAsync(userId);
                return Ok(new { message = "User approved successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ رفض مستخدم
        [HttpPut("reject-user/{userId}")]
        public async Task<IActionResult> RejectUser(int userId)
        {
            try
            {
                await _adminService.RejectUserAsync(userId);
                return Ok(new { message = "User rejected successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ جلب الـ Pets الـ Pending
        [HttpGet("pending-pets")]
        public async Task<IActionResult> GetPendingPets()
        {
            try
            {
                var pets = await _adminService.GetPendingPetsAsync();
                return Ok(pets);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ اعتماد Pet
        [HttpPut("approve-pet/{petId}")]
        public async Task<IActionResult> ApprovePet(int petId)
        {
            try
            {
                await _adminService.ApprovePetAsync(petId);
                return Ok(new { message = "Pet approved successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ رفض Pet
        [HttpDelete("reject-pet/{petId}")]
        public async Task<IActionResult> RejectPet(int petId)
        {
            try
            {
                await _adminService.RejectPetAsync(petId);
                return Ok(new { message = "Pet rejected successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}