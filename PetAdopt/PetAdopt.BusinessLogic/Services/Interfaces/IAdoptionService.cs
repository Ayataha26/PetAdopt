using PetAdopt.BusinessLogic.DTOs.Adoption;

namespace PetAdopt.BusinessLogic.Services.Interfaces
{
    public interface IAdoptionService
    {
        Task<AdoptionResponseDto> SubmitRequestAsync(int petId, int adopterId);
        Task AcceptRequestAsync(int requestId, int ownerId);
        Task RejectRequestAsync(int requestId, int ownerId);
        Task<IEnumerable<AdoptionResponseDto>> GetMyRequestsAsync(int adopterId);
        Task<IEnumerable<AdoptionResponseDto>> GetRequestsForMyPetsAsync(int ownerId);
    }
}