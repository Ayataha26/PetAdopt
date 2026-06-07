namespace PetAdopt.BusinessLogic.DTOs.Review
{
    public class CreateReviewDto
    {
        public int OwnerId { get; set; }
        public int AdoptionRequestId { get; set; }
        public int Rating { get; set; }  // من 1 لـ 5
        public string Comment { get; set; }
    }
}