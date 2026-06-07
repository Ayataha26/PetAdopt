using PetAdopt.BusinessLogic.DTOs.Pet;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;
using PetAdopt.BusinessLogic.Services.Interfaces;

using Microsoft.Extensions.Caching.Memory;

namespace PetAdopt.BusinessLogic.Services
{
    public class PetService : IPetService
    {
        private readonly IPetRepository _petRepo;
        private readonly IMemoryCache _cache;

        public PetService(IPetRepository petRepo, IMemoryCache cache)
        {
            _petRepo = petRepo;
            _cache = cache;
        }

        public async Task<IEnumerable<PetResponseDto>> GetAllApprovedAsync(
            string animalType, string breed, int? age, string location)
        {
            string cacheKey = $"Pets_{animalType}_{breed}_{age}_{location}";

            if (!_cache.TryGetValue(cacheKey, out IEnumerable<PetResponseDto> cachedPets))
            {
                var pets = await _petRepo.GetAllApprovedAsync(animalType, breed, age, location);
                cachedPets = pets.Select(MapToDto).ToList();

                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(5));

                _cache.Set(cacheKey, cachedPets, cacheOptions);
            }

            return cachedPets;
        }

        public async Task<PetResponseDto> GetByIdAsync(int id)
        {
            var pet = await _petRepo.GetByIdAsync(id);
            if (pet == null) throw new Exception("Pet not found");
            return MapToDto(pet);
        }

        public async Task<IEnumerable<PetResponseDto>> GetMyPetsAsync(int ownerId)
        {
            var pets = await _petRepo.GetByOwnerIdAsync(ownerId);
            return pets.Select(MapToDto);
        }

        public async Task<IEnumerable<PetResponseDto>> GetPendingApprovalAsync()
        {
            var pets = await _petRepo.GetPendingApprovalAsync();
            return pets.Select(MapToDto);
        }

        public async Task<PetResponseDto> CreateAsync(CreatePetDto dto, int ownerId)
        {
            var pet = new Pet
            {
                OwnerId = ownerId,
                PetName = dto.PetName,
                AnimalType = dto.AnimalType,
                Breed = dto.Breed,
                Age = dto.Age,
                Gender = dto.Gender,
                HealthStatus = dto.HealthStatus,
                Description = dto.Description,
                Location = dto.Location,
                ListedOwnerName = dto.ListedOwnerName ?? "",
                Status = "Available",
                IsApproved = false,
                Images = new List<PetImage>()
            };

            if (dto.Images != null && dto.Images.Count > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "pets");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                foreach (var file in dto.Images)
                {
                    if (file.Length > 0)
                    {
                        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                        if (extension != ".jpg" && extension != ".jpeg" && extension != ".png")
                        {
                            throw new Exception($"File '{file.FileName}' has an invalid extension. Only .jpg, .jpeg, and .png are allowed.");
                        }

                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                        }
                        var relativeUrl = $"/uploads/pets/{uniqueFileName}";
                        pet.Images.Add(new PetImage { ImageUrl = relativeUrl });
                    }
                }
            }

            await _petRepo.AddAsync(pet);
            return MapToDto(pet);
        }

        public async Task UpdateAsync(int id, CreatePetDto dto, int ownerId)
        {
            var pet = await _petRepo.GetByIdAsync(id);
            if (pet == null) throw new Exception("Pet not found");
            if (pet.OwnerId != ownerId) throw new UnauthorizedAccessException("Not your pet");

            pet.PetName = dto.PetName;
            pet.AnimalType = dto.AnimalType;
            pet.Breed = dto.Breed;
            pet.Age = dto.Age;
            pet.Gender = dto.Gender;
            pet.HealthStatus = dto.HealthStatus;
            pet.Description = dto.Description;
            pet.Location = dto.Location;
            pet.ListedOwnerName = dto.ListedOwnerName ?? pet.ListedOwnerName;

            if (dto.Images != null && dto.Images.Count > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "pets");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Optional: For simplicity, we just add new images. If you want to replace them, you'd clear pet.Images first.
                // Here we'll just add the new ones to existing.
                if (pet.Images == null) pet.Images = new List<PetImage>();

                foreach (var file in dto.Images)
                {
                    if (file.Length > 0)
                    {
                        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                        if (extension != ".jpg" && extension != ".jpeg" && extension != ".png")
                        {
                            throw new Exception($"File '{file.FileName}' has an invalid extension. Only .jpg, .jpeg, and .png are allowed.");
                        }

                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                        }
                        var relativeUrl = $"/uploads/pets/{uniqueFileName}";
                        pet.Images.Add(new PetImage { ImageUrl = relativeUrl });
                    }
                }
            }

            await _petRepo.UpdateAsync(pet);
        }

        public async Task DeleteAsync(int id, int ownerId)
        {
            var pet = await _petRepo.GetByIdAsync(id);
            if (pet == null) throw new Exception("Pet not found");
            if (pet.OwnerId != ownerId) throw new UnauthorizedAccessException("Not your pet");

            await _petRepo.DeleteAsync(id);
        }

        public async Task ApproveAsync(int id)
        {
            var pet = await _petRepo.GetByIdAsync(id);
            if (pet == null) throw new Exception("Pet not found");

            pet.IsApproved = true;
            await _petRepo.UpdateAsync(pet);
        }

        public async Task RejectAsync(int id)
        {
            var pet = await _petRepo.GetByIdAsync(id);
            if (pet == null) throw new Exception("Pet not found");

            await _petRepo.DeleteAsync(id);
        }

        private PetResponseDto MapToDto(Pet pet)
        {
            var fallbackOwnerName = pet.Owner?.FullName;
            var finalOwnerName = !string.IsNullOrWhiteSpace(pet.ListedOwnerName) 
                ? pet.ListedOwnerName 
                : fallbackOwnerName;

            var images = new List<string>();
            if (pet.Images != null && pet.Images.Any())
            {
                images = pet.Images.Select(i => i.ImageUrl).ToList();
            }
            else
            {
                images.Add("https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800"); // default fallback image
            }

            return new PetResponseDto
            {
                Id = pet.Id,
                PetName = pet.PetName,
                AnimalType = pet.AnimalType,
                Breed = pet.Breed,
                Age = pet.Age,
                Gender = pet.Gender,
                HealthStatus = pet.HealthStatus,
                Description = pet.Description,
                Location = pet.Location,
                Status = pet.Status,
                IsApproved = pet.IsApproved,
                CreatedAt = pet.CreatedAt,
                OwnerName = finalOwnerName,
                Images = images
            };
        }
    }
}