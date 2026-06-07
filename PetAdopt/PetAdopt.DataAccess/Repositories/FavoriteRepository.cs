using Microsoft.EntityFrameworkCore;
using PetAdopt.DataAccess.Data;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;

namespace PetAdopt.DataAccess.Repositories
{
    public class FavoriteRepository : GenericRepository<Favorite>, IFavoriteRepository
    {
        public FavoriteRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Favorite>> GetByUserIdAsync(int userId)
        {
            return await _context.Favorites
                .Include(f => f.Pet)
                .ThenInclude(p => p.Images)
                .Include(f => f.Pet)
                .ThenInclude(p => p.Owner)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> IsFavoriteAsync(int userId, int petId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.PetId == petId);
        }

        public async Task RemoveAsync(int userId, int petId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PetId == petId);

            if (favorite != null)
            {
                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();
            }
        }
    }
}