using Microsoft.EntityFrameworkCore;
using PetAdopt.DataAccess.Data;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;

namespace PetAdopt.DataAccess.Repositories
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        public ReviewRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Review>> GetByOwnerIdAsync(int ownerId)
        {
            return await _context.Reviews
                .Include(r => r.Reviewer)
                .Include(r => r.Owner)
                .Where(r => r.OwnerId == ownerId)
                .ToListAsync();
        }

        public override async Task<Review> GetByIdAsync(int id)
        {
            return await _context.Reviews
                .Include(r => r.Reviewer)
                .Include(r => r.Owner)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<bool> HasReviewedAsync(int adoptionRequestId, int reviewerId)
        {
            return await _context.Reviews
                .AnyAsync(r => r.AdoptionRequestId == adoptionRequestId
                            && r.ReviewerId == reviewerId);
        }
    }
}