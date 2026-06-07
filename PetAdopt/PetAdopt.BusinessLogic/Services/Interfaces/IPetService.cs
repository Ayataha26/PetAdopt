using PetAdopt.BusinessLogic.DTOs.Pet;

namespace PetAdopt.BusinessLogic.Services.Interfaces
{
    public interface IPetService
    {
        Task<IEnumerable<PetResponseDto>> GetAllApprovedAsync(
            string animalType, string breed, int? age, string location);

        Task<PetResponseDto> GetByIdAsync(int id);

        Task<IEnumerable<PetResponseDto>> GetMyPetsAsync(int ownerId);

        Task<IEnumerable<PetResponseDto>> GetPendingApprovalAsync();

        Task<PetResponseDto> CreateAsync(CreatePetDto dto, int ownerId);

        Task UpdateAsync(int id, CreatePetDto dto, int ownerId);

        Task DeleteAsync(int id, int ownerId);

        Task ApproveAsync(int id);

        Task RejectAsync(int id);
    }
}