namespace PetAdopt.DataAccess.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int ReviewerId { get; set; }
        public User Reviewer { get; set; }
        public int OwnerId { get; set; }
        public User Owner { get; set; }
        public int AdoptionRequestId { get; set; }
        public AdoptionRequest AdoptionRequest { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
