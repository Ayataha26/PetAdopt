using PetAdopt.BusinessLogic.DTOs.Review;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;
using PetAdopt.BusinessLogic.Services.Interfaces;

namespace PetAdopt.BusinessLogic.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepo;
        private readonly IAdoptionRepository _adoptionRepo;

        public ReviewService(IReviewRepository reviewRepo, IAdoptionRepository adoptionRepo)
        {
            _reviewRepo = reviewRepo;
            _adoptionRepo = adoptionRepo;
        }

        // ✅ Adopter يكتب Review بعد التبني
        public async Task<ReviewResponseDto> CreateReviewAsync(CreateReviewDto dto, int reviewerId)
        {
            // تأكد إن الـ AdoptionRequest موجود ومقبول
            var adoptionRequest = await _adoptionRepo.GetByIdAsync(dto.AdoptionRequestId);
            if (adoptionRequest == null)
                throw new Exception("Adoption request not found");

            if (adoptionRequest.Status != "Accepted")
                throw new Exception("You can only review after adoption is accepted");

            if (adoptionRequest.AdopterId != reviewerId)
                throw new Exception("This is not your adoption request");

            // تأكد إنه مكتبش Review قبل كده
            var alreadyReviewed = await _reviewRepo.HasReviewedAsync(
                dto.AdoptionRequestId, reviewerId);
            if (alreadyReviewed)
                throw new Exception("You already reviewed this adoption");

            // تأكد إن الـ Rating بين 1 و 5
            if (dto.Rating < 1 || dto.Rating > 5)
                throw new Exception("Rating must be between 1 and 5");

            var review = new Review
            {
                ReviewerId = reviewerId,
                OwnerId = dto.OwnerId,
                AdoptionRequestId = dto.AdoptionRequestId,
                Rating = dto.Rating,
                Comment = dto.Comment
            };

            await _reviewRepo.AddAsync(review);

            return new ReviewResponseDto
            {
                Id = review.Id,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                ReviewerName = adoptionRequest.Adopter?.FullName,
                OwnerName = adoptionRequest.Pet?.Owner?.FullName
            };
        }

        // ✅ جلب Reviews بتاعت Owner معين
        public async Task<IEnumerable<ReviewResponseDto>> GetOwnerReviewsAsync(int ownerId)
        {
            var reviews = await _reviewRepo.GetByOwnerIdAsync(ownerId);
            return reviews.Select(r => new ReviewResponseDto
            {
                Id = r.Id,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                ReviewerName = r.Reviewer?.FullName,
                OwnerName = r.Owner?.FullName
            });
        }
    }
}