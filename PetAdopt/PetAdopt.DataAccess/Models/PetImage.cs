namespace PetAdopt.DataAccess.Models
{
    public class PetImage
    {
        public int Id { get; set; }
        public int PetId { get; set; }
        public Pet Pet { get; set; }
        public string ImageUrl { get; set; }
    }
}
