using PetAdopt.BusinessLogic.DTOs.Pet;

namespace PetAdopt.BusinessLogic.Services.Interfaces
{
    public interface IFavoriteService
    {
        Task<IEnumerable<PetResponseDto>> GetMyFavoritesAsync(int userId);
        Task AddToFavoritesAsync(int userId, int petId);
        Task RemoveFromFavoritesAsync(int userId, int petId);
        Task<bool> IsFavoriteAsync(int userId, int petId);
    }
}