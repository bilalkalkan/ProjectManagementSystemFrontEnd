import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";

import { ProjectService } from "../../services/project.service";
import { RoleService } from "../../../../core/services/role.service";
import { AvatarService } from "../../../../core/services/avatar.service";
import { AddMemberDialogComponent } from "../add-member-dialog/add-member-dialog.component";
import { Project } from "../../../../core/models/project.model";
import {
  ProjectMember,
  ProjectRole,
  ProjectPermission,
} from "../../../../core/models/role.model";
import { HasPermissionDirective } from "../../../../shared/directives/has-permission.directive";
import { HasRoleDirective } from "../../../../shared/directives/has-role.directive";

@Component({
  selector: "app-project-members",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    HasPermissionDirective,
    HasRoleDirective,
  ],
  template: `
    <div class="container">
      <mat-card class="members-card">
        <mat-card-header>
          <mat-card-title>
            <div class="header-container">
              <div class="title-container">
                <button mat-icon-button [routerLink]="['/projects', projectId]">
                  <mat-icon>arrow_back</mat-icon>
                </button>
                <h2>Proje Üyeleri ve Rolleri</h2>
              </div>
              <div class="actions-container">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="openAddMemberDialog()"
                  *appHasPermission="'canManageMembers'; role: currentUserRole"
                >
                  <mat-icon>person_add</mat-icon>
                  Üye Ekle
                </button>
              </div>
            </div>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Üyeler yükleniyor...</p>
          </div>

          <div *ngIf="!isLoading && members.length === 0" class="empty-state">
            <mat-icon>people_outline</mat-icon>
            <p>Bu projede henüz üye bulunmuyor.</p>
          </div>

          <table
            mat-table
            [dataSource]="members"
            class="members-table"
            *ngIf="!isLoading && members.length > 0"
          >
            <!-- Avatar Sütunu -->
            <ng-container matColumnDef="avatar">
              <th mat-header-cell *matHeaderCellDef>Avatar</th>
              <td mat-cell *matCellDef="let member">
                <div
                  class="avatar-container"
                  [style.background-color]="
                    avatarService.getAvatarColor(member.user.id)
                  "
                >
                  {{
                    avatarService.getInitials(
                      member.user.firstName,
                      member.user.lastName
                    )
                  }}
                </div>
              </td>
            </ng-container>

            <!-- Kullanıcı Adı Sütunu -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Kullanıcı</th>
              <td mat-cell *matCellDef="let member">
                {{ member.user.firstName }} {{ member.user.lastName }}
              </td>
            </ng-container>

            <!-- Email Sütunu -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let member">
                {{ member.user.email }}
              </td>
            </ng-container>

            <!-- Rol Sütunu -->
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Rol</th>
              <td mat-cell *matCellDef="let member">
                <mat-form-field
                  *appHasPermission="'canManageMembers'; role: currentUserRole"
                  appearance="outline"
                  class="role-select"
                >
                  <mat-select
                    [value]="member.role"
                    (selectionChange)="
                      updateMemberRole(member.userId, $event.value)
                    "
                    [disabled]="
                      member.role === ProjectRole.Owner ||
                      member.userId === currentUserId
                    "
                  >
                    <mat-option
                      *ngFor="let role of availableRoles"
                      [value]="role.value"
                    >
                      {{ role.label }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <span *ngIf="!hasPermission('canManageMembers')">
                  {{ getRoleName(member.role) }}
                </span>
              </td>
            </ng-container>

            <!-- Katılma Tarihi Sütunu -->
            <ng-container matColumnDef="joinedAt">
              <th mat-header-cell *matHeaderCellDef>Katılma Tarihi</th>
              <td mat-cell *matCellDef="let member">
                {{ member.joinedAt | date : "dd.MM.yyyy" }}
              </td>
            </ng-container>

            <!-- İşlemler Sütunu -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>İşlemler</th>
              <td mat-cell *matCellDef="let member">
                <button
                  mat-icon-button
                  color="warn"
                  (click)="removeMember(member.userId)"
                  *appHasPermission="'canManageMembers'; role: currentUserRole"
                  [disabled]="
                    member.role === ProjectRole.Owner ||
                    member.userId === currentUserId
                  "
                  matTooltip="Üyeyi Kaldır"
                >
                  <mat-icon>person_remove</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
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

      .members-card {
        margin-bottom: 20px;
      }

      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .title-container {
        display: flex;
        align-items: center;
      }

      .title-container h2 {
        margin: 0 0 0 10px;
      }

      .members-table {
        width: 100%;
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

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
      }

      .loading-container p {
        margin-top: 16px;
        color: rgba(0, 0, 0, 0.6);
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        color: rgba(0, 0, 0, 0.6);
      }

      .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class ProjectMembersComponent implements OnInit {
  projectId: string = "";
  project?: Project;
  members: ProjectMember[] = [];
  isLoading: boolean = true;
  currentUserRole: ProjectRole = ProjectRole.Viewer;
  currentUserId: number = 0;

  ProjectRole = ProjectRole; // Template'te kullanmak için

  displayedColumns: string[] = [
    "avatar",
    "name",
    "email",
    "role",
    "joinedAt",
    "actions",
  ];

  availableRoles = [
    { value: ProjectRole.Admin, label: "Yönetici" },
    { value: ProjectRole.Member, label: "Üye" },
    { value: ProjectRole.Viewer, label: "İzleyici" },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public avatarService: AvatarService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.projectId = id;
        this.loadProject(id);
      } else {
        this.router.navigate(["/projects"]);
      }
    });

    // Mevcut kullanıcı ID'sini al
    const currentUser = this.roleService.getCurrentUser();
    if (currentUser) {
      this.currentUserId = currentUser.id;
    }
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        this.project = project;
        this.currentUserRole = project.currentUserRole || ProjectRole.Viewer;
        this.loadMembers(id);
      },
      error: (error) => {
        console.error("Proje yüklenirken hata oluştu:", error);
        this.snackBar.open("Proje yüklenirken bir hata oluştu", "Kapat", {
          duration: 3000,
        });
        this.router.navigate(["/projects"]);
        this.isLoading = false;
      },
    });
  }

  loadMembers(projectId: string): void {
    this.projectService.getProjectMembers(projectId).subscribe({
      next: (members) => {
        this.members = members;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Üyeler yüklenirken hata oluştu:", error);
        this.snackBar.open("Üyeler yüklenirken bir hata oluştu", "Kapat", {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  updateMemberRole(userId: number, newRole: ProjectRole): void {
    if (!this.projectId) return;

    this.projectService
      .updateUserRole(this.projectId, userId, newRole)
      .subscribe({
        next: () => {
          this.snackBar.open("Kullanıcı rolü başarıyla güncellendi", "Kapat", {
            duration: 3000,
          });

          // Üye listesini güncelle
          const memberIndex = this.members.findIndex(
            (m) => m.userId === userId
          );
          if (memberIndex !== -1) {
            this.members[memberIndex].role = newRole;
          }
        },
        error: (error) => {
          console.error("Rol güncellenirken hata oluştu:", error);
          this.snackBar.open("Rol güncellenirken bir hata oluştu", "Kapat", {
            duration: 3000,
          });
        },
      });
  }

  removeMember(userId: number): void {
    if (!this.projectId) return;

    if (confirm("Bu üyeyi projeden kaldırmak istediğinize emin misiniz?")) {
      this.projectService.removeMember(this.projectId, userId).subscribe({
        next: () => {
          this.snackBar.open("Üye başarıyla kaldırıldı", "Kapat", {
            duration: 3000,
          });

          // Üyeyi listeden kaldır
          this.members = this.members.filter((m) => m.userId !== userId);
        },
        error: (error) => {
          console.error("Üye kaldırılırken hata oluştu:", error);
          this.snackBar.open("Üye kaldırılırken bir hata oluştu", "Kapat", {
            duration: 3000,
          });
        },
      });
    }
  }

  openAddMemberDialog(): void {
    // Üye ekleme diyaloğunu aç
    const existingMemberIds = this.members.map((m) => m.userId);

    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: "500px",
      data: { projectId: this.projectId, currentMembers: existingMemberIds },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addMember(result.userId, result.role);
      }
    });
  }

  addMember(userId: number, role: ProjectRole): void {
    if (!this.projectId) return;

    this.projectService.addMember(this.projectId, userId).subscribe({
      next: () => {
        // Rol atama
        this.projectService
          .updateUserRole(this.projectId, userId, role)
          .subscribe({
            next: () => {
              this.snackBar.open(
                "Üye başarıyla eklendi ve rol atandı",
                "Kapat",
                {
                  duration: 3000,
                }
              );

              // Üye listesini yeniden yükle
              this.loadMembers(this.projectId);
            },
            error: (error) => {
              console.error("Rol atama sırasında hata oluştu:", error);
              this.snackBar.open("Üye eklendi fakat rol atanamadı", "Kapat", {
                duration: 3000,
              });

              // Üye listesini yeniden yükle
              this.loadMembers(this.projectId);
            },
          });
      },
      error: (error) => {
        console.error("Üye eklenirken hata oluştu:", error);
        this.snackBar.open("Üye eklenirken bir hata oluştu", "Kapat", {
          duration: 3000,
        });
      },
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

  hasPermission(permission: keyof ProjectPermission): boolean {
    return this.roleService.hasPermission(this.currentUserRole, permission);
  }
}
