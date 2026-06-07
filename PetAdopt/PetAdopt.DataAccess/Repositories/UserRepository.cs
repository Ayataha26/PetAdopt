using Microsoft.EntityFrameworkCore;
using PetAdopt.DataAccess.Data;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;

namespace PetAdopt.DataAccess.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<User> GetByEmailAsync(string email) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        public async Task<IEnumerable<User>> GetPendingUsersAsync() =>
            await _context.Users.Where(u => u.Status == "Pending").ToListAsync();
    }
}