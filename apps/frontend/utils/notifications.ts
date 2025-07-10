export class NotificationManager {
  private audio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.audio = new Audio("/notification-sound.mp3");
    }
  }

  async requestPermission() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }

  showNotification(title: string, body: string, icon?: string) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: icon || "/chat-icon.png",
        badge: "/chat-icon.png",
      });
    }
  }

  playSound() {
    if (this.audio) {
      this.audio.play().catch(console.error);
    }
  }

  notifyNewMessage(username: string, message: string) {
    this.showNotification(
      `Нове повідомлення від ${username}`,
      message.length > 50 ? message.substring(0, 50) + "..." : message
    );
    this.playSound();
  }
}

export const notificationManager = new NotificationManager();
