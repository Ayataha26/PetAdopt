using PetAdopt.DataAccess.Models;

namespace PetAdopt.BusinessLogic.Services.Interfaces
{
    public interface IAdminService
    {
        // إدارة المستخدمين
        Task<IEnumerable<User>> GetPendingUsersAsync();
        Task ApproveUserAsync(int userId);
        Task RejectUserAsync(int userId);

        // إدارة الـ Pets
        Task<IEnumerable<Pet>> GetPendingPetsAsync();
        Task ApprovePetAsync(int petId);
        Task RejectPetAsync(int petId);
    }
}