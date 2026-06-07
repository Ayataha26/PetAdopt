using Microsoft.AspNetCore.Mvc;
using PetAdopt.BusinessLogic.DTOs.Auth;
using PetAdopt.BusinessLogic.Helpers;
using PetAdopt.BusinessLogic.Services.Interfaces;

namespace PetAdopt.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService) => _authService = authService;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(ApiResponse<string>.SuccessResponse(result, "User registered successfully."));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto);
            return Ok(ApiResponse<object>.SuccessResponse(new { token }, "Login successful."));
        }
        [HttpGet("generate-hash")]
        public IActionResult GenerateHash()
        {
            var hash = BCrypt.Net.BCrypt.HashPassword("123456");
            return Ok(new { hash });
        }
    }
}