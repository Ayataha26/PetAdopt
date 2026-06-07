using PetAdopt.DataAccess.Models;

namespace PetAdopt.BusinessLogic.Services.Interfaces
{
    public interface INotificationService
    {
        Task SendNotificationAsync(int userId, string message);
        Task<IEnumerable<Notification>> GetMyNotificationsAsync(int userId);
        Task<int> GetUnreadCountAsync(int userId);
        Task MarkAsReadAsync(int notificationId, int userId);
        Task MarkAllAsReadAsync(int userId);
    }
}