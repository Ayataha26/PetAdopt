using PetAdopt.BusinessLogic.DTOs.Review;

namespace PetAdopt.BusinessLogic.Services.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewResponseDto> CreateReviewAsync(CreateReviewDto dto, int reviewerId);
        Task<IEnumerable<ReviewResponseDto>> GetOwnerReviewsAsync(int ownerId);
    }
}