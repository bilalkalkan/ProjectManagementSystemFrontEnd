import { Component, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { MatMenu } from "@angular/material/menu";
import { User } from "../../core/models/user.model";

interface Notification {
  id: string;
  message: string;
  icon: string;
  color: string;
  read: boolean;
  createdAt: Date;
}

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
  standalone: false,
})
export class MainLayoutComponent {
  @ViewChild("sidenav") sidenav!: MatSidenav;
  @ViewChild("notificationMenu") notificationMenu!: MatMenu;
  @ViewChild("userMenu") userMenu!: MatMenu;

  currentUser: User | null = null;
  notifications: Notification[] = [
    {
      id: "1",
      message: "Yeni görev atandı: Homepage tasarımı",
      icon: "assignment",
      color: "primary",
      read: false,
      createdAt: new Date(),
    },
    // ... diğer bildirimler
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }

  markAllNotificationsAsRead() {
    this.notifications = this.notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
  }
}
