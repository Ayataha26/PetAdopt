namespace PetAdopt.DataAccess.Models
{
    public class AdoptionRequest
    {
        public int Id { get; set; }
        public int PetId { get; set; }
        public Pet Pet { get; set; }
        public int AdopterId { get; set; }
        public User Adopter { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    }
}
