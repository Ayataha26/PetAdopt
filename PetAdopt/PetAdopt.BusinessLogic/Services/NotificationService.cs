using Microsoft.AspNetCore.SignalR;
using PetAdopt.BusinessLogic.Hubs;
using PetAdopt.DataAccess.Models;
using PetAdopt.DataAccess.Repositories.Interfaces;
using PetAdopt.BusinessLogic.Services.Interfaces;

namespace PetAdopt.BusinessLogic.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepo;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(
            INotificationRepository notificationRepo,
            IHubContext<NotificationHub> hubContext)
        {
            _notificationRepo = notificationRepo;
            _hubContext = hubContext;
        }

        // ✅ بيحفظ الإشعار في الداتابيز وبيبعته فوري عن طريق SignalR
        public async Task SendNotificationAsync(int userId, string message)
        {
            // حفظ في الداتابيز
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationRepo.AddAsync(notification);

            // بعت فوري عن طريق SignalR
            await _hubContext.Clients
                .Group($"user_{userId}")
                .SendAsync("ReceiveNotification", new
                {
                    id = notification.Id,
                    message = notification.Message,
                    isRead = notification.IsRead,
                    createdAt = notification.CreatedAt
                });
        }

        // ✅ جلب إشعارات الـ User
        public async Task<IEnumerable<Notification>> GetMyNotificationsAsync(int userId)
        {
            return await _notificationRepo.GetByUserIdAsync(userId);
        }

        // ✅ عدد الإشعارات غير المقروءة
        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _notificationRepo.GetUnreadCountAsync(userId);
        }

        // ✅ تعليم إشعار كمقروء
        public async Task MarkAsReadAsync(int notificationId, int userId)
        {
            await _notificationRepo.MarkAsReadAsync(notificationId, userId);
        }

        // ✅ تعليم كل الإشعارات كمقروءة
        public async Task MarkAllAsReadAsync(int userId)
        {
            await _notificationRepo.MarkAllAsReadAsync(userId);
        }
    }
}