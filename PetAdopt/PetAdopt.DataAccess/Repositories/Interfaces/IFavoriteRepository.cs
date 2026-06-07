using PetAdopt.DataAccess.Models;

namespace PetAdopt.DataAccess.Repositories.Interfaces
{
    public interface IFavoriteRepository : IGenericRepository<Favorite>
    {
        Task<IEnumerable<Favorite>> GetByUserIdAsync(int userId);
        Task<bool> IsFavoriteAsync(int userId, int petId);
        Task RemoveAsync(int userId, int petId);
    }
}