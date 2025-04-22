import { Component, ViewChild, OnInit } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { MatMenu } from "@angular/material/menu";
import { User } from "../../core/models/user.model";
import { HasPermissionDirective } from "../../shared/directives/has-permission.directive";
import { HasRoleDirective } from "../../shared/directives/has-role.directive";

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
export class MainLayoutComponent implements OnInit {
  @ViewChild("sidenav", { static: true }) sidenav!: MatSidenav;
  @ViewChild("notificationMenu") notificationMenu!: MatMenu;
  @ViewChild("userMenu") userMenu!: MatMenu;

  currentUser: User | null = null;
  userRole: string = "USER";

  // Menü öğelerinin görünürlük ayarları
  menuPermissions: { [key: string]: { roles: string[] } } = {
    // Proje Yönetimi
    projects: { roles: ["ADMIN", "USER", "PROJECT_MANAGER"] },
    tasks: { roles: ["ADMIN", "USER", "PROJECT_MANAGER"] },
    kanban: { roles: ["ADMIN", "USER", "PROJECT_MANAGER"] },
    gantt: { roles: ["ADMIN", "USER", "PROJECT_MANAGER"] },

    // Ekip Yönetimi
    team: { roles: ["ADMIN", "PROJECT_MANAGER"] },
    roles: { roles: ["ADMIN"] },

    // Planlama
    calendar: { roles: ["ADMIN", "USER", "PROJECT_MANAGER"] },
    meetings: { roles: ["ADMIN", "USER", "PROJECT_MANAGER"] },

    // Raporlar & Analiz
    reportsOverview: { roles: ["ADMIN", "PROJECT_MANAGER"] },
    reportsPerformance: { roles: ["ADMIN", "PROJECT_MANAGER"] },
    reportsTime: { roles: ["ADMIN", "PROJECT_MANAGER", "USER"] },

    // Ayarlar
    settings: { roles: ["ADMIN"] },
    profile: { roles: ["ADMIN", "USER", "PROJECT_MANAGER"] },
  };

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

  ngOnInit(): void {
    // Kullanıcı bilgilerini al
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.userRole = user.role;
        console.log("Kullanıcı rolü:", this.userRole);
      }
    });
  }

  // Menü öğesinin görünürlüğünü kontrol et
  hasMenuPermission(menuKey: string): boolean {
    if (!this.currentUser || !this.menuPermissions[menuKey]) {
      return false;
    }

    console.log(
      `Menü öğesi: ${menuKey}, Kullanıcı rolü: ${this.userRole}, İzin verilen roller:`,
      this.menuPermissions[menuKey].roles
    );

    // Rol kontrolü
    const hasPermission = this.menuPermissions[menuKey].roles.includes(
      this.userRole
    );
    console.log(`${menuKey} için izin:`, hasPermission);

    return hasPermission;
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
