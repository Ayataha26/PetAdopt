using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;
using PetAdopt.BusinessLogic.Services.Interfaces;

namespace PetAdopt.BusinessLogic.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepo;
        private readonly IPetRepository _petRepo;

        public AdminService(IAdminRepository adminRepo, IPetRepository petRepo)
        {
            _adminRepo = adminRepo;
            _petRepo = petRepo;
        }

        // ✅ جلب المستخدمين اللي لسه Pending
        public async Task<IEnumerable<User>> GetPendingUsersAsync()
        {
            return await _adminRepo.GetPendingUsersAsync();
        }

        // ✅ Admin يقبل مستخدم جديد
        public async Task ApproveUserAsync(int userId)
        {
            var user = await _adminRepo.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            if (user.Status != "Pending")
                throw new Exception("User is not pending");

            user.Status = "Approved";
            await _adminRepo.UpdateAsync(user);
        }

        // ✅ Admin يرفض مستخدم جديد
        public async Task RejectUserAsync(int userId)
        {
            var user = await _adminRepo.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            if (user.Status != "Pending")
                throw new Exception("User is not pending");

            user.Status = "Rejected";
            await _adminRepo.UpdateAsync(user);
        }

        // ✅ جلب الـ Pets اللي لسه محتاجة Approval
        public async Task<IEnumerable<Pet>> GetPendingPetsAsync()
        {
            return await _petRepo.GetPendingApprovalAsync();
        }

        // ✅ Admin يعتمد Pet
        public async Task ApprovePetAsync(int petId)
        {
            var pet = await _petRepo.GetByIdAsync(petId);
            if (pet == null)
                throw new Exception("Pet not found");

            pet.IsApproved = true;
            await _petRepo.UpdateAsync(pet);
        }

        // ✅ Admin يرفض Pet
        public async Task RejectPetAsync(int petId)
        {
            var pet = await _petRepo.GetByIdAsync(petId);
            if (pet == null)
                throw new Exception("Pet not found");

            await _petRepo.DeleteAsync(petId);
        }
    }
}