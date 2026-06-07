using Microsoft.EntityFrameworkCore;
using PetAdopt.DataAccess.Models;

namespace PetAdopt.DataAccess.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<PetImage> PetImages { get; set; }
        public DbSet<AdoptionRequest> AdoptionRequests { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ============ Global Query Filters (Soft Delete) ============
            modelBuilder.Entity<Pet>().HasQueryFilter(p => !p.IsDeleted);
            modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);

            // ============ Indexes ============
            modelBuilder.Entity<Pet>().HasIndex(p => p.AnimalType);
            modelBuilder.Entity<Pet>().HasIndex(p => p.Breed);
            modelBuilder.Entity<Pet>().HasIndex(p => p.Location);
            modelBuilder.Entity<Pet>().HasIndex(p => p.Status);
            modelBuilder.Entity<Pet>().HasIndex(p => p.IsApproved);

            // Review - Reviewer
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Reviewer)
                .WithMany()
                .HasForeignKey(r => r.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Review - Owner
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Owner)
                .WithMany()
                .HasForeignKey(r => r.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // AdoptionRequest - Adopter
            modelBuilder.Entity<AdoptionRequest>()
                .HasOne(a => a.Adopter)
                .WithMany(u => u.AdoptionRequests)
                .HasForeignKey(a => a.AdopterId)
                .OnDelete(DeleteBehavior.Restrict);

            // Favorites - User
            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Favorites - Pet
            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Pet)
                .WithMany(p => p.Favorites)
                .HasForeignKey(f => f.PetId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}