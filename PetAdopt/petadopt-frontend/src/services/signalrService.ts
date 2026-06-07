import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '../store/authStore';

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private baseUrl = import.meta.env.VITE_HUB_URL || 'http://localhost:5247/hubs/notifications';

    public startConnection() {
        const token = useAuthStore.getState().token;

        if (!token) return;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.baseUrl}?access_token=${token}`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        this.connection.start()
            .then(() => console.log('SignalR Connected'))
            .catch(err => console.error('SignalR Connection Error: ', err));
    }

    public stopConnection() {
        if (this.connection) {
            this.connection.stop();
            this.connection = null;
        }
    }

    public onNotificationReceived(callback: (notification: any) => void) {
        if (this.connection) {
            this.connection.on('ReceiveNotification', callback);
        }
    }

    public offNotificationReceived(callback: (notification: any) => void) {
        if (this.connection) {
            this.connection.off('ReceiveNotification', callback);
        }
    }
}

export const signalRService = new SignalRService();
