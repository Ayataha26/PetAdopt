using PetAdopt.DataAccess.Models;

namespace PetAdopt.DataAccess.Repositories.Interfaces
{
    public interface IAdoptionRepository : IGenericRepository<AdoptionRequest>
    {
        Task<IEnumerable<AdoptionRequest>> GetByPetIdAsync(int petId);
        Task<IEnumerable<AdoptionRequest>> GetByAdopterIdAsync(int adopterId);
        Task<IEnumerable<AdoptionRequest>> GetByOwnerIdAsync(int ownerId);
        Task<bool> HasPendingRequestAsync(int petId, int adopterId);
    }
}