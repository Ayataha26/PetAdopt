using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdopt.BusinessLogic.DTOs.Pet;
using PetAdopt.BusinessLogic.Services.Interfaces;
using System.Security.Claims;

namespace PetAdopt.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PetController : ControllerBase
    {
        private readonly IPetService _petService;

        public PetController(IPetService petService)
        {
            _petService = petService;
        }

        // ✅ Public - أي حد يقدر يشوف الـ Pets
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? animalType,
            [FromQuery] string? breed,
            [FromQuery] int? age,
            [FromQuery] string? location)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole == "Shelter")
            {
                return Forbid();
            }

            var pets = await _petService.GetAllApprovedAsync(animalType, breed, age, location);
            return Ok(pets);
        }

        // ✅ Public - جلب Pet معينة بالـ ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var pet = await _petService.GetByIdAsync(id);
                return Ok(pet);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ✅ Shelter/PetOwner - جلب الـ Pets بتاعته
        [HttpGet("my-pets")]
        [Authorize(Roles = "Shelter")]
        public async Task<IActionResult> GetMyPets()
        {
            var ownerId = GetUserId();
            var pets = await _petService.GetMyPetsAsync(ownerId);
            return Ok(pets);
        }

        // ✅ Admin - جلب الـ Pets اللي لسه محتاجة Approval
        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPending()
        {
            var pets = await _petService.GetPendingApprovalAsync();
            return Ok(pets);
        }

        // ✅ Shelter/PetOwner - إضافة Pet جديدة
        [HttpPost]
        [Authorize(Roles = "Shelter")]
        public async Task<IActionResult> Create([FromForm] CreatePetDto dto)
        {
            try
            {
                var ownerId = GetUserId();
                var pet = await _petService.CreateAsync(dto, ownerId);
                return Ok(new { message = "Pet created successfully, waiting for admin approval", pet });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ Shelter/PetOwner - تعديل Pet
        [HttpPut("{id}")]
        [Authorize(Roles = "Shelter")]
        public async Task<IActionResult> Update(int id, [FromForm] CreatePetDto dto)
        {
            try
            {
                var ownerId = GetUserId();
                await _petService.UpdateAsync(id, dto, ownerId);
                return Ok(new { message = "Pet updated successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ Shelter/PetOwner - حذف Pet
        [HttpDelete("{id}")]
        [Authorize(Roles = "Shelter")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var ownerId = GetUserId();
                await _petService.DeleteAsync(id, ownerId);
                return Ok(new { message = "Pet deleted successfully" });
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

        // ✅ Admin - اعتماد Pet
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Approve(int id)
        {
            try
            {
                await _petService.ApproveAsync(id);
                return Ok(new { message = "Pet approved successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ Admin - رفض Pet
        [HttpDelete("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Reject(int id)
        {
            try
            {
                await _petService.RejectAsync(id);
                return Ok(new { message = "Pet rejected and removed" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ Helper - جلب الـ User ID من الـ Token
        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }
    }
}