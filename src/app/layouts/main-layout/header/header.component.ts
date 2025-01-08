import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { NotificationService } from "../../../core/services/notification.service";
import { ThemeService } from "../../../core/services/theme.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenavEvent = new EventEmitter<void>();
  notifications: any[] = [];
  unreadCount = 0;
  isDarkMode = false;
  user = this.authService.currentUserValue;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.loadNotifications();
    this.themeService.darkMode$.subscribe(
      (isDark) => (this.isDarkMode = isDark)
    );
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
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

  onNotificationClick(notification: any) {
    this.notificationService.markAsRead(notification.id);
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  logout() {
    // TODO: Implement logout logic
    this.router.navigate(["/auth/login"]);
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });

    this.notificationService.getUnreadCount().subscribe((count) => {
      this.unreadCount = count;
    });
  }

  markAllAsRead() {
    this.notifications.forEach((notification) => {
      this.notificationService.markAsRead(notification.id);
    });
  }

  toggleSidenav() {
    this.toggleSidenavEvent.emit();
  }
}
