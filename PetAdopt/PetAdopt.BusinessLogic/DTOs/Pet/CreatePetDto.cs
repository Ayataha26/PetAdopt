namespace PetAdopt.BusinessLogic.DTOs.Pet
{
    public class CreatePetDto
    {
        public string PetName { get; set; }
        public string AnimalType { get; set; }
        public string Breed { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string HealthStatus { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string ListedOwnerName { get; set; }
        
        public List<Microsoft.AspNetCore.Http.IFormFile>? Images { get; set; }
    }
}