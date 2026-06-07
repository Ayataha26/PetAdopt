using PetAdopt.BusinessLogic.DTOs.Auth;
using PetAdopt.BusinessLogic.Helpers;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;
using PetAdopt.BusinessLogic.Services.Interfaces;

namespace PetAdopt.BusinessLogic.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly JwtHelper _jwtHelper;

        public AuthService(IUserRepository userRepo, JwtHelper jwtHelper)
        {
            _userRepo = userRepo;
            _jwtHelper = jwtHelper;
        }

        public async Task<string> RegisterAsync(RegisterDto dto)
        {
            var existing = await _userRepo.GetByEmailAsync(dto.Email);
            if (existing != null) throw new Exception("Email already exists");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                Status = "Pending"
            };

            await _userRepo.AddAsync(user);
            return "Registered successfully. Waiting for admin approval.";
        }

        public async Task<string> LoginAsync(LoginDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Wrong credentials");

            if (user.Status == "Pending")
                throw new Exception("Please wait for the admin approval.");
            
            if (user.Status == "Rejected")
                throw new Exception("The admin rejected your registration.");

            if (user.Status != "Approved")
                throw new Exception("Account not approved yet.");

            return _jwtHelper.GenerateToken(user);
        }
    }
}