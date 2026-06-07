using PetAdopt.DataAccess.Models;

namespace PetAdopt.DataAccess.Repositories.Interfaces
{
    public interface IReviewRepository : IGenericRepository<Review>
    {
        Task<IEnumerable<Review>> GetByOwnerIdAsync(int ownerId);
        Task<bool> HasReviewedAsync(int adoptionRequestId, int reviewerId);
    }
}