using Microsoft.EntityFrameworkCore;
using PetAdopt.DataAccess.Data;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;

namespace PetAdopt.DataAccess.Repositories
{
    public class PetRepository : GenericRepository<Pet>, IPetRepository
    {
        public PetRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Pet>> GetAllApprovedAsync(string animalType, string breed, int? age, string location)
        {
            var query = _context.Pets
                .Include(p => p.Images)
                .Include(p => p.Owner)
                .AsSplitQuery()
                .Where(p => p.IsApproved && p.Status == "Available");

            if (!string.IsNullOrEmpty(animalType)) query = query.Where(p => p.AnimalType == animalType);
            if (!string.IsNullOrEmpty(breed)) query = query.Where(p => p.Breed == breed);
            if (age.HasValue) query = query.Where(p => p.Age == age);
            if (!string.IsNullOrEmpty(location)) query = query.Where(p => p.Location.Contains(location));

            return await query.ToListAsync();
        }

        public override async Task<Pet> GetByIdAsync(int id) =>
            await _context.Pets.Include(p => p.Images).Include(p => p.Owner).AsSplitQuery().FirstOrDefaultAsync(p => p.Id == id);

        public async Task<IEnumerable<Pet>> GetByOwnerIdAsync(int ownerId) =>
            await _context.Pets.Include(p => p.Images).AsSplitQuery().Where(p => p.OwnerId == ownerId).ToListAsync();

        public async Task<IEnumerable<Pet>> GetPendingApprovalAsync() =>
            await _context.Pets.Include(p => p.Owner).Where(p => !p.IsApproved).ToListAsync();
    }
}