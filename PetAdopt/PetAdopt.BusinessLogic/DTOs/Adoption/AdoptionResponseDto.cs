namespace PetAdopt.BusinessLogic.DTOs.Adoption
{
    public class AdoptionResponseDto
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public DateTime RequestDate { get; set; }

        // Pet info
        public int PetId { get; set; }
        public string PetName { get; set; }
        public string AnimalType { get; set; }
        public string PetLocation { get; set; }
        public int PetOwnerId { get; set; }

        // Adopter info
        public int AdopterId { get; set; }
        public string AdopterName { get; set; }
        public string AdopterEmail { get; set; }
    }
}