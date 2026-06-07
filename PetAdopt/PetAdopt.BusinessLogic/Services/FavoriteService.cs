using PetAdopt.BusinessLogic.DTOs.Pet;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;
using PetAdopt.BusinessLogic.Services.Interfaces;

namespace PetAdopt.BusinessLogic.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepo;
        private readonly IPetRepository _petRepo;

        public FavoriteService(IFavoriteRepository favoriteRepo, IPetRepository petRepo)
        {
            _favoriteRepo = favoriteRepo;
            _petRepo = petRepo;
        }

        // ✅ جلب المفضلة بتاعت الـ User
        public async Task<IEnumerable<PetResponseDto>> GetMyFavoritesAsync(int userId)
        {
            var favorites = await _favoriteRepo.GetByUserIdAsync(userId);
            return favorites.Select(f => new PetResponseDto
            {
                Id = f.Pet.Id,
                PetName = f.Pet.PetName,
                AnimalType = f.Pet.AnimalType,
                Breed = f.Pet.Breed,
                Age = f.Pet.Age,
                Gender = f.Pet.Gender,
                HealthStatus = f.Pet.HealthStatus,
                Description = f.Pet.Description,
                Location = f.Pet.Location,
                Status = f.Pet.Status,
                IsApproved = f.Pet.IsApproved,
                CreatedAt = f.Pet.CreatedAt,
                OwnerName = f.Pet.Owner?.FullName,
                Images = f.Pet.Images?.Select(i => i.ImageUrl).ToList() ?? new List<string>()
            });
        }

        // ✅ إضافة Pet للمفضلة
        public async Task AddToFavoritesAsync(int userId, int petId)
        {
            var pet = await _petRepo.GetByIdAsync(petId);
            if (pet == null)
                throw new Exception("Pet not found");

            var alreadyFavorite = await _favoriteRepo.IsFavoriteAsync(userId, petId);
            if (alreadyFavorite)
                throw new Exception("Pet already in favorites");

            var favorite = new Favorite
            {
                UserId = userId,
                PetId = petId
            };

            await _favoriteRepo.AddAsync(favorite);
        }

        // ✅ إزالة Pet من المفضلة
        public async Task RemoveFromFavoritesAsync(int userId, int petId)
        {
            var isFavorite = await _favoriteRepo.IsFavoriteAsync(userId, petId);
            if (!isFavorite)
                throw new Exception("Pet not in favorites");

            await _favoriteRepo.RemoveAsync(userId, petId);
        }

        // ✅ هل الـ Pet في المفضلة؟
        public async Task<bool> IsFavoriteAsync(int userId, int petId)
        {
            return await _favoriteRepo.IsFavoriteAsync(userId, petId);
        }
    }
}