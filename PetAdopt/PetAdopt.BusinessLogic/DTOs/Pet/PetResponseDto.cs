namespace PetAdopt.BusinessLogic.DTOs.Pet
{
    public class PetResponseDto
    {
        public int Id { get; set; }
        public string PetName { get; set; }
        public string AnimalType { get; set; }
        public string Breed { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string HealthStatus { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }

        // Owner info
        public string OwnerName { get; set; }

        // Images
        public List<string> Images { get; set; }
    }
}