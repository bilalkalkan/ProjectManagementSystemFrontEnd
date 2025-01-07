import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  NotificationService,
  Notification,
} from "../../../core/services/notification.service";
import { ThemeService } from "../../../core/services/theme.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  isDarkMode = false;

  constructor(
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });

    this.notificationService.getUnreadCount().subscribe((count) => {
      this.unreadCount = count;
    });

    this.themeService.darkMode$.subscribe(
      (isDark) => (this.isDarkMode = isDark)
    );
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case "success":
        return "check_circle";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "info";
    }
  }

  onNotificationClick(notification: Notification) {
    this.notificationService.markAsRead(notification.id);
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  logout() {
    // TODO: Implement logout logic
    this.router.navigate(["/auth/login"]);
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
}
