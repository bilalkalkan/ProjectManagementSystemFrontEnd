import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  isRead: boolean;
  link?: string;
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);

  // Örnek bildirimler
  private dummyNotifications: Notification[] = [
    {
      id: "1",
      title: "Yeni Görev",
      message: "API Entegrasyonu görevi size atandı",
      type: "info",
      timestamp: new Date(),
      isRead: false,
      link: "/tasks",
    },
    {
      id: "2",
      title: "Görev Tamamlandı",
      message: "Test Yazılması görevi tamamlandı",
      type: "success",
      timestamp: new Date(),
      isRead: false,
      link: "/projects/1/tasks",
    },
  ];

  constructor() {
    this.notifications.next(this.dummyNotifications);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  markAsRead(id: string) {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map((notification) =>
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    this.notifications.next(updatedNotifications);
  }

  getUnreadCount(): Observable<number> {
    return new Observable((observer) => {
      this.notifications.subscribe((notifications) => {
        observer.next(notifications.filter((n) => !n.isRead).length);
      });
    });
  }
}
