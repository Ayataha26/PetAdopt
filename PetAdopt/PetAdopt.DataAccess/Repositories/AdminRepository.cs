using Microsoft.EntityFrameworkCore;
using PetAdopt.DataAccess.Data;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;

namespace PetAdopt.DataAccess.Repositories
{
    public class AdminRepository : GenericRepository<User>, IAdminRepository
    {
        public AdminRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<User>> GetPendingUsersAsync()
        {
            return await _context.Users
                .Where(u => u.Status == "Pending")
                .ToListAsync();
        }
    }
}