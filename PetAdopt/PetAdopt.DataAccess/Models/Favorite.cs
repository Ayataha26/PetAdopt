namespace PetAdopt.DataAccess.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int PetId { get; set; }
        public Pet Pet { get; set; }
    }
}
