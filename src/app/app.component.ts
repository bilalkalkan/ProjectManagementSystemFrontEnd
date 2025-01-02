import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./core/services/auth.service";
import { MatDialog } from "@angular/material/dialog";

interface CurrentUser {
  name: string;
  email: string;
  avatarUrl: string;
  // ... diğer özellikler
}

@Component({
  selector: "app-root",
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="navbar-brand">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="brand-text">Proje Yönetimi</span>
      </div>

      <div class="nav-links">
        <a mat-button routerLink="/dashboard" routerLinkActive="active">
          <mat-icon>dashboard</mat-icon>
          Dashboard
        </a>
        <a mat-button routerLink="/projects" routerLinkActive="active">
          <mat-icon>folder</mat-icon>
          Projeler
        </a>
        <a mat-button routerLink="/tasks" routerLinkActive="active">
          <mat-icon>assignment</mat-icon>
          Görevler
        </a>
        <a mat-button routerLink="/team" routerLinkActive="active">
          <mat-icon>group</mat-icon>
          Takım
        </a>
      </div>

      <div class="navbar-actions">
        <!-- Bildirimler -->
        <button mat-icon-button [matMenuTriggerFor]="notificationMenu">
          <mat-icon [matBadge]="3" matBadgeColor="warn">notifications</mat-icon>
        </button>
        <mat-menu #notificationMenu="matMenu" class="notification-menu">
          <div class="notification-header">
            <h4>Bildirimler</h4>
            <button mat-button color="primary">Tümünü Gör</button>
          </div>
          <mat-divider></mat-divider>
          <div class="notification-list">
            <button mat-menu-item *ngFor="let notification of notifications">
              <mat-icon [color]="notification.color">{{
                notification.icon
              }}</mat-icon>
              <span>{{ notification.message }}</span>
              <small>{{ notification.time | timeAgo }}</small>
            </button>
          </div>
        </mat-menu>

        <!-- Hızlı Eylemler -->
        <button mat-icon-button [matMenuTriggerFor]="quickActionsMenu">
          <mat-icon>add_circle</mat-icon>
        </button>
        <mat-menu #quickActionsMenu="matMenu">
          <button mat-menu-item routerLink="/projects/new">
            <mat-icon color="primary">folder_open</mat-icon>
            <span>Yeni Proje</span>
          </button>
          <button mat-menu-item (click)="openTaskDialog()">
            <mat-icon color="accent">assignment</mat-icon>
            <span>Hızlı Görev</span>
          </button>
          <button mat-menu-item>
            <mat-icon color="warn">report</mat-icon>
            <span>Rapor Oluştur</span>
          </button>
        </mat-menu>

        <!-- Kullanıcı Menüsü -->
        <button
          mat-icon-button
          [matMenuTriggerFor]="userMenu"
          class="user-button"
        >
          <img
            [src]="
              currentUser ? currentUser.avatarUrl : 'assets/default-avatar.png'
            "
            class="user-avatar"
            alt="user avatar"
          />
        </button>
        <mat-menu #userMenu="matMenu" class="user-menu">
          <div class="user-header">
            <img
              [src]="
                currentUser
                  ? currentUser.avatarUrl
                  : 'assets/default-avatar.png'
              "
              alt="user"
            />
            <div class="user-info">
              <h4>{{ currentUser ? currentUser.name : "" }}</h4>
              <small>{{ currentUser ? currentUser.email : "" }}</small>
            </div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>Profil</span>
          </button>
          <button mat-menu-item routerLink="/settings">
            <mat-icon>settings</mat-icon>
            <span>Ayarlar</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Çıkış Yap</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav #sidenav mode="side" [opened]="true">
        <!-- Sidebar içeriği -->
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/projects" routerLinkActive="active">
            <mat-icon matListItemIcon>folder</mat-icon>
            <span>Projeler</span>
          </a>
          <a mat-list-item routerLink="/tasks" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span>Görevler</span>
          </a>
          <a mat-list-item routerLink="/team" routerLinkActive="active">
            <mat-icon matListItemIcon>group</mat-icon>
            <span>Takım</span>
          </a>
          <mat-divider></mat-divider>
          <a mat-list-item routerLink="/reports" routerLinkActive="active">
            <mat-icon matListItemIcon>assessment</mat-icon>
            <span>Raporlar</span>
          </a>
          <a mat-list-item routerLink="/calendar" routerLinkActive="active">
            <mat-icon matListItemIcon>calendar_today</mat-icon>
            <span>Takvim</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
      }

      .navbar-brand {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .brand-text {
        font-size: 1.2rem;
        font-weight: 500;
      }

      .nav-links {
        display: flex;
        gap: 8px;
      }

      .nav-links a {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .nav-links a.active {
        background: rgba(255, 255, 255, 0.1);
      }

      .navbar-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }

      .notification-header,
      .user-header {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .user-header {
        gap: 16px;
      }

      .user-header img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }

      .user-info h4 {
        margin: 0;
        font-size: 1rem;
      }

      .user-info small {
        color: rgba(0, 0, 0, 0.6);
      }

      mat-sidenav-container {
        height: calc(100vh - 64px);
      }

      mat-sidenav {
        width: 250px;
        padding: 16px;
      }

      .mat-list-item.active {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
  ],
  standalone: false,
})
export class AppComponent {
  notifications = [
    {
      message: "Yeni görev atandı",
      icon: "assignment",
      color: "primary",
      time: new Date(),
    },
    {
      message: "Proje güncellemesi",
      icon: "update",
      color: "accent",
      time: new Date(Date.now() - 3600000),
    },
    {
      message: "Toplantı hatırlatması",
      icon: "event",
      color: "warn",
      time: new Date(Date.now() - 7200000),
    },
  ];

  currentUser: CurrentUser | null = null;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  openTaskDialog() {
    // Hızlı görev ekleme dialogu
    console.log("Görev ekleme dialogu açılacak");
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }
}
