namespace PetAdopt.BusinessLogic.DTOs.Review
{
    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        // مين كتب الـ Review
        public string ReviewerName { get; set; }

        // مين اتعمله الـ Review (الـ Owner)
        public string OwnerName { get; set; }
    }
}