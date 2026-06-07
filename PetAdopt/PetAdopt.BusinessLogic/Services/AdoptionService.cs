using PetAdopt.BusinessLogic.DTOs.Adoption;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;
using PetAdopt.BusinessLogic.Services.Interfaces;

namespace PetAdopt.BusinessLogic.Services
{
    public class AdoptionService : IAdoptionService
    {
        private readonly IAdoptionRepository _adoptionRepo;
        private readonly IPetRepository _petRepo;
        private readonly INotificationService _notificationService;

        public AdoptionService(
            IAdoptionRepository adoptionRepo,
            IPetRepository petRepo,
            INotificationService notificationService)
        {
            _adoptionRepo = adoptionRepo;
            _petRepo = petRepo;
            _notificationService = notificationService;
        }

        // ✅ Adopter يبعت طلب تبني
        public async Task<AdoptionResponseDto> SubmitRequestAsync(int petId, int adopterId)
        {
            var pet = await _petRepo.GetByIdAsync(petId);
            if (pet == null)
                throw new Exception("Pet not found");

            if (pet.Status == "Adopted")
                throw new Exception("Pet is already adopted");

            var alreadyRequested = await _adoptionRepo.HasPendingRequestAsync(petId, adopterId);
            if (alreadyRequested)
                throw new Exception("You already have a pending request for this pet");

            var request = new AdoptionRequest
            {
                PetId = petId,
                AdopterId = adopterId,
                Status = "Pending",
                RequestDate = DateTime.UtcNow
            };

            await _adoptionRepo.AddAsync(request);

            // ✅ بعت إشعار للـ Owner إن في طلب جديد
            await _notificationService.SendNotificationAsync(
                pet.OwnerId,
                $"You have a new adoption request for your pet {pet.PetName}!"
            );

            return MapToDto(request, pet, null);
        }

        // ✅ Owner يقبل الطلب + إشعار فوري للـ Adopter
        public async Task AcceptRequestAsync(int requestId, int ownerId)
        {
            var request = await _adoptionRepo.GetByIdAsync(requestId);
            if (request == null)
                throw new Exception("Request not found");

            if (request.Pet.OwnerId != ownerId)
                throw new UnauthorizedAccessException("Not your pet");

            if (request.Status != "Pending")
                throw new Exception("Request is not pending");

            request.Status = "Accepted";
            request.Pet.Status = "Adopted";

            // Reject all other pending requests for this pet
            var otherRequests = await _adoptionRepo.GetByPetIdAsync(request.PetId);
            foreach (var otherReq in otherRequests.Where(r => r.Id != requestId && r.Status == "Pending"))
            {
                otherReq.Status = "Rejected";
                await _adoptionRepo.UpdateAsync(otherReq);
                
                await _notificationService.SendNotificationAsync(
                    otherReq.AdopterId,
                    $"Sorry, the pet {request.Pet.PetName} has been adopted by someone else."
                );
            }

            await _adoptionRepo.UpdateAsync(request);

            // ✅ إشعار فوري للـ Adopter
            await _notificationService.SendNotificationAsync(
                request.AdopterId,
                $"Congratulations! Your adoption request for {request.Pet.PetName} has been accepted!"
            );
        }

        // ✅ Owner يرفض الطلب + إشعار فوري للـ Adopter
        public async Task RejectRequestAsync(int requestId, int ownerId)
        {
            var request = await _adoptionRepo.GetByIdAsync(requestId);
            if (request == null)
                throw new Exception("Request not found");

            if (request.Pet.OwnerId != ownerId)
                throw new UnauthorizedAccessException("Not your pet");

            if (request.Status != "Pending")
                throw new Exception("Request is not pending");

            request.Status = "Rejected";

            await _adoptionRepo.UpdateAsync(request);

            // ✅ إشعار فوري للـ Adopter
            await _notificationService.SendNotificationAsync(
                request.AdopterId,
                $"Sorry, your adoption request for {request.Pet.PetName} has been rejected."
            );
        }

        // ✅ Adopter يشوف طلباته
        public async Task<IEnumerable<AdoptionResponseDto>> GetMyRequestsAsync(int adopterId)
        {
            var requests = await _adoptionRepo.GetByAdopterIdAsync(adopterId);
            return requests.Select(r => MapToDto(r, r.Pet, r.Adopter));
        }

        // ✅ Owner يشوف الطلبات على الـ Pets بتاعته
        public async Task<IEnumerable<AdoptionResponseDto>> GetRequestsForMyPetsAsync(int ownerId)
        {
            var requests = await _adoptionRepo.GetByOwnerIdAsync(ownerId);
            return requests.Select(r => MapToDto(r, r.Pet, r.Adopter));
        }

        // ✅ Helper
        private AdoptionResponseDto MapToDto(AdoptionRequest request, Pet pet, User adopter)
        {
            return new AdoptionResponseDto
            {
                Id = request.Id,
                Status = request.Status,
                RequestDate = request.RequestDate,
                PetId = pet?.Id ?? 0,
                PetName = pet?.PetName,
                AnimalType = pet?.AnimalType,
                PetLocation = pet?.Location,
                PetOwnerId = pet?.OwnerId ?? 0,
                AdopterId = adopter?.Id ?? 0,
                AdopterName = adopter?.FullName,
                AdopterEmail = adopter?.Email
            };
        }
    }
}