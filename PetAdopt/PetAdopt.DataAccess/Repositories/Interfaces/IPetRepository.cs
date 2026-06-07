using PetAdopt.DataAccess.Models;

namespace PetAdopt.DataAccess.Repositories.Interfaces
{
    public interface IPetRepository : IGenericRepository<Pet>
    {
        Task<IEnumerable<Pet>> GetAllApprovedAsync(string animalType, string breed, int? age, string location);
        Task<IEnumerable<Pet>> GetByOwnerIdAsync(int ownerId);
        Task<IEnumerable<Pet>> GetPendingApprovalAsync();
    }
}