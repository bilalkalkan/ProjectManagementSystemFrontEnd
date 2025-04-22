import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { NotificationService } from "../../../core/services/notification.service";
import { ThemeService } from "../../../core/services/theme.service";
import { AvatarService } from "../../../core/services/avatar.service";

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
  user: any = this.authService.currentUserValue;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private avatarService: AvatarService
  ) {}

  ngOnInit() {
    this.loadNotifications();
    this.themeService.darkMode$.subscribe(
      (isDark) => (this.isDarkMode = isDark)
    );

    // Kullanıcı bilgilerini güncelle
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      console.log("Header user:", this.user);
    });
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
    this.authService.logout();
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

  getAvatarUrl(): string {
    if (this.user?.avatarUrl) {
      return this.user.avatarUrl;
    }

    if (this.user?.id) {
      return this.avatarService.getAvatarUrl(this.user.id);
    }

    // Default avatar
    return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
  }
}
