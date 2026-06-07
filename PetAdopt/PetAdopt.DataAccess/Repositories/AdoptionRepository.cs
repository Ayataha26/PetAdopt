using Microsoft.EntityFrameworkCore;
using PetAdopt.DataAccess.Data;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;

namespace PetAdopt.DataAccess.Repositories
{
    public class AdoptionRepository : GenericRepository<AdoptionRequest>, IAdoptionRepository
    {
        public AdoptionRepository(AppDbContext context) : base(context) { }

        public override async Task<AdoptionRequest> GetByIdAsync(int id)
        {
            return await _context.AdoptionRequests
                .Include(a => a.Pet)
                .Include(a => a.Adopter)
                .FirstOrDefaultAsync(a => a.Id == id);
        }



        public async Task<IEnumerable<AdoptionRequest>> GetByPetIdAsync(int petId)
        {
            return await _context.AdoptionRequests
                .Include(a => a.Adopter)
                .Where(a => a.PetId == petId)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdoptionRequest>> GetByAdopterIdAsync(int adopterId)
        {
            return await _context.AdoptionRequests
                .Include(a => a.Pet)
                .ThenInclude(p => p.Images)
                .Where(a => a.AdopterId == adopterId)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdoptionRequest>> GetByOwnerIdAsync(int ownerId)
        {
            return await _context.AdoptionRequests
                .Include(a => a.Pet)
                .Include(a => a.Adopter)
                .Where(a => a.Pet.OwnerId == ownerId)
                .ToListAsync();
        }

        public async Task<bool> HasPendingRequestAsync(int petId, int adopterId)
        {
            return await _context.AdoptionRequests
                .AnyAsync(a => a.PetId == petId
                            && a.AdopterId == adopterId
                            && a.Status == "Pending");
        }
    }
}