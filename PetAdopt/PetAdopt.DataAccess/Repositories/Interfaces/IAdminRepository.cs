using PetAdopt.DataAccess.Models;

namespace PetAdopt.DataAccess.Repositories.Interfaces
{
    public interface IAdminRepository : IGenericRepository<User>
    {
        Task<IEnumerable<User>> GetPendingUsersAsync();
    }
}