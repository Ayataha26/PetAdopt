using PetAdopt.BusinessLogic.DTOs.Auth;

namespace PetAdopt.BusinessLogic.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto dto);
        Task<string> LoginAsync(LoginDto dto);
    }
}