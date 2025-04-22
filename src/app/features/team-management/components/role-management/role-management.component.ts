import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { RoleService } from "../../../../core/services/role.service";
import { UserService } from "../../../../core/services/user.service";
import {
  ProjectRole,
  ProjectPermission,
} from "../../../../core/models/role.model";
import { User } from "../../../../core/models/user.model";

@Component({
  selector: "app-role-management",
  template: `
    <div class="container">
      <mat-card class="roles-card">
        <mat-card-header>
          <mat-card-title>
            <h2>Roller ve İzinler Yönetimi</h2>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="roles-section">
            <h3>Sistem Rolleri</h3>
            <p>
              Sistemdeki roller ve bu rollerin sahip olduğu izinler aşağıda
              listelenmiştir.
            </p>

            <div class="roles-grid">
              <mat-card class="role-card" *ngFor="let role of systemRoles">
                <mat-card-header>
                  <mat-card-title>{{ getRoleName(role.role) }}</mat-card-title>
                  <mat-card-subtitle>{{ role.description }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <h4>İzinler:</h4>
                  <div class="permissions-list">
                    <mat-chip-set>
                      <mat-chip
                        *ngFor="
                          let permission of getPermissionsForRole(role.role)
                        "
                        color="primary"
                        highlighted
                      >
                        {{ getPermissionName(permission) }}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>

          <mat-divider class="section-divider"></mat-divider>

          <div class="users-section">
            <h3>Kullanıcı Rolleri</h3>
            <p>Sistemdeki kullanıcılar ve rolleri aşağıda listelenmiştir.</p>

            <table mat-table [dataSource]="users" class="users-table">
              <!-- Avatar Sütunu -->
              <ng-container matColumnDef="avatar">
                <th mat-header-cell *matHeaderCellDef>Avatar</th>
                <td mat-cell *matCellDef="let user">
                  <div
                    class="avatar-container"
                    [style.background-color]="getAvatarColor(user.id)"
                  >
                    {{ getInitials(user.firstName || "", user.lastName || "") }}
                  </div>
                </td>
              </ng-container>

              <!-- Kullanıcı Adı Sütunu -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Kullanıcı</th>
                <td mat-cell *matCellDef="let user">
                  {{ user.firstName }} {{ user.lastName }}
                </td>
              </ng-container>

              <!-- Email Sütunu -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">
                  {{ user.email }}
                </td>
              </ng-container>

              <!-- Rol Sütunu -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Rol</th>
                <td mat-cell *matCellDef="let user">
                  <mat-form-field appearance="outline" class="role-select">
                    <mat-select
                      [value]="user.role"
                      (selectionChange)="updateUserRole(user.id, $event.value)"
                    >
                      <mat-option
                        *ngFor="let role of systemRoles"
                        [value]="role.roleValue"
                      >
                        {{ role.name }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .roles-card {
        margin-bottom: 20px;
      }

      .section-divider {
        margin: 30px 0;
      }

      .roles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .role-card {
        height: 100%;
      }

      .permissions-list {
        margin-top: 10px;
      }

      .users-table {
        width: 100%;
        margin-top: 20px;
      }

      .avatar-container {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 500;
      }

      .role-select {
        width: 150px;
      }
    `,
  ],
})
export class RoleManagementComponent implements OnInit {
  systemRoles = [
    {
      role: ProjectRole.Owner,
      roleValue: "OWNER",
      name: "Sahip",
      description:
        "Tüm projelerde tam yetkiye sahiptir. Proje oluşturabilir, düzenleyebilir ve silebilir.",
    },
    {
      role: ProjectRole.Admin,
      roleValue: "ADMIN",
      name: "Yönetici",
      description:
        "Projelerde geniş yetkiye sahiptir. Üyeleri yönetebilir ve proje ayarlarını değiştirebilir.",
    },
    {
      role: ProjectRole.Member,
      roleValue: "MEMBER",
      name: "Üye",
      description:
        "Projelerde görevleri görüntüleyebilir, oluşturabilir ve düzenleyebilir.",
    },
    {
      role: ProjectRole.Viewer,
      roleValue: "VIEWER",
      name: "İzleyici",
      description:
        "Projeleri ve görevleri sadece görüntüleyebilir, değişiklik yapamaz.",
    },
  ];

  users: User[] = [];
  displayedColumns: string[] = ["avatar", "name", "email", "role"];

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log("RoleManagementComponent initialized");
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error("Kullanıcılar yüklenirken hata oluştu:", error);
        this.snackBar.open(
          "Kullanıcılar yüklenirken bir hata oluştu",
          "Kapat",
          {
            duration: 3000,
          }
        );
      },
    });
  }

  updateUserRole(userId: number, newRole: any): void {
    // Burada API'ye rol güncelleme isteği gönderilecek
    console.log(`Kullanıcı ${userId} için rol güncelleniyor: ${newRole}`);
    this.snackBar.open("Kullanıcı rolü başarıyla güncellendi", "Kapat", {
      duration: 3000,
    });
  }

  getRoleName(role: ProjectRole): string {
    switch (role) {
      case ProjectRole.Owner:
        return "Sahip";
      case ProjectRole.Admin:
        return "Yönetici";
      case ProjectRole.Member:
        return "Üye";
      case ProjectRole.Viewer:
        return "İzleyici";
      default:
        return "Bilinmeyen";
    }
  }

  getPermissionsForRole(role: ProjectRole): string[] {
    const permissions = this.roleService.getPermissionsForRole(role);
    return Object.entries(permissions)
      .filter(([_, hasPermission]) => hasPermission)
      .map(([permissionKey, _]) => permissionKey);
  }

  getPermissionName(permission: string): string {
    const permissionNames: { [key: string]: string } = {
      canView: "Görüntüleme",
      canEdit: "Düzenleme",
      canDelete: "Silme",
      canCreate: "Oluşturma",
      canManageMembers: "Üye Yönetimi",
      canManageRoles: "Rol Yönetimi",
      canManageSettings: "Ayar Yönetimi",
      canExport: "Dışa Aktarma",
      canImport: "İçe Aktarma",
      canComment: "Yorum Yapma",
      canAssignTasks: "Görev Atama",
    };

    return permissionNames[permission] || permission;
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return (firstInitial + lastInitial).toUpperCase();
  }

  getAvatarColor(id: number): string {
    const colors = [
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#9E9E9E",
      "#607D8B",
    ];

    return colors[id % colors.length];
  }
}
