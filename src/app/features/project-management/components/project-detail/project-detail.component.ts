import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Project, ProjectStatus } from "../../../../core/models/project.model";
import { ProjectService } from "../../services/project.service";
import { AddMemberDialogComponent } from "../add-member-dialog/add-member-dialog.component";
import { DeleteProjectDialogComponent } from "../delete-project-dialog/delete-project-dialog.component";
import { take } from "rxjs/operators";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import {
  ProjectRole,
  ProjectMember,
  ProjectPermission,
} from "../../../../core/models/role.model";
import { RoleService } from "../../../../core/services/role.service";
import { HasRoleDirective } from "../../../../shared/directives/has-role.directive";
import { HasPermissionDirective } from "../../../../shared/directives/has-permission.directive";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatDialogModule } from "@angular/material/dialog";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TaskService } from "../../../task-management/services/task.service";
import { AvatarService } from "../../../../core/services/avatar.service";

@Component({
  selector: "app-project-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    HasRoleDirective,
    HasPermissionDirective,
  ],
  template: `
    <div class="loading-container" *ngIf="isLoading">
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      <p class="loading-text">Proje yükleniyor...</p>
    </div>

    <div class="project-detail-container" *ngIf="project && !isLoading">
      <!-- Üst Bilgi Kartı -->
      <mat-card class="header-card">
        <div class="project-header">
          <div class="title-section">
            <h1>{{ project.title || project.name }}</h1>
            <mat-chip-set>
              <mat-chip
                [color]="getStatusColor(project.status)"
                [ngClass]="getStatusClass(project.status)"
              >
                {{ getStatusText(project.status) }}
              </mat-chip>
            </mat-chip-set>
          </div>
          <div class="actions">
            <button
              mat-raised-button
              color="primary"
              (click)="editProject()"
              class="action-button"
              *appHasPermission="'canEdit'; role: currentUserRole"
            >
              <mat-icon>edit</mat-icon>
              <span>Düzenle</span>
            </button>
            <button
              mat-raised-button
              [routerLink]="['board']"
              class="action-button"
              *appHasPermission="'canView'; role: currentUserRole"
            >
              <mat-icon>dashboard</mat-icon>
              <span>Görev Tahtası</span>
            </button>

            <button
              mat-raised-button
              [routerLink]="['members']"
              class="action-button"
              *appHasPermission="'canView'; role: currentUserRole"
            >
              <mat-icon>people</mat-icon>
              <span>Üyeler ve Roller</span>
            </button>
            <button
              mat-raised-button
              [color]="isActiveStatus(project.status) ? 'warn' : 'primary'"
              (click)="toggleStatus()"
              class="action-button"
              *appHasPermission="'canEdit'; role: currentUserRole"
            >
              <mat-icon>{{
                isActiveStatus(project.status) ? "pause" : "play_arrow"
              }}</mat-icon>
              <span>{{
                isActiveStatus(project.status) ? "Pasife Al" : "Aktif Et"
              }}</span>
            </button>
            <button
              mat-raised-button
              color="warn"
              (click)="deleteProject()"
              class="action-button"
              *appHasPermission="'canDelete'; role: currentUserRole"
            >
              <mat-icon>delete</mat-icon>
              <span>Sil</span>
            </button>
          </div>
        </div>
      </mat-card>

      <!-- Proje Detayları Grid -->
      <div class="details-grid">
        <!-- Proje Bilgileri -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Proje Bilgileri</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-item">
              <mat-icon>description</mat-icon>
              <div class="info-content">
                <strong>Açıklama</strong>
                <p>{{ project.description }}</p>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>event</mat-icon>
              <div class="info-content">
                <strong>Başlangıç Tarihi</strong>
                <p>{{ project.startDate | date : "dd.MM.yyyy" }}</p>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>event_busy</mat-icon>
              <div class="info-content">
                <strong>Bitiş Tarihi</strong>
                <p>
                  {{ project.endDate || project.dueDate | date : "dd.MM.yyyy" }}
                </p>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>trending_up</mat-icon>
              <div class="info-content">
                <strong>İlerleme</strong>
                <mat-progress-bar
                  mode="determinate"
                  [value]="project.progress || 0"
                  [color]="isActiveStatus(project.status) ? 'primary' : 'warn'"
                >
                </mat-progress-bar>
                <span>%{{ project.progress }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Üyeler Kartı -->
        <mat-card class="members-card">
          <mat-card-header>
            <mat-card-title>
              Proje Üyeleri
              <button
                mat-icon-button
                color="primary"
                (click)="addMember()"
                *appHasPermission="'canManageMembers'; role: currentUserRole"
              >
                <mat-icon>person_add</mat-icon>
              </button>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="empty-members" *ngIf="!project.members?.length">
              <mat-icon>group_off</mat-icon>
              <p>Henüz üye eklenmemiş</p>
              <button
                mat-stroked-button
                color="primary"
                (click)="addMember()"
                *appHasPermission="'canManageMembers'; role: currentUserRole"
              >
                <mat-icon>person_add</mat-icon>
                Üye Ekle
              </button>
            </div>

            <mat-list *ngIf="project.members?.length">
              <mat-list-item
                *ngFor="let memberId of project.members"
                class="member-item"
              >
                <img
                  matListItemAvatar
                  [src]="avatarService.getAvatarUrl(memberId)"
                  [alt]="'Üye #' + memberId"
                  class="member-avatar"
                />
                <div matListItemTitle class="member-name">
                  Üye #{{ memberId }}
                </div>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="removeMember(memberId)"
                  class="remove-button"
                  *appHasPermission="'canManageMembers'; role: currentUserRole"
                >
                  <mat-icon>person_remove</mat-icon>
                </button>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- İstatistikler Kartı -->
        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Proje İstatistikleri</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ todoCount }}</div>
                <div class="stat-label">Yapılacak</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ inProgressCount }}</div>
                <div class="stat-label">Devam Eden</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ completedCount }}</div>
                <div class="stat-label">Tamamlanan</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ project.members?.length || project.teamMembersCount || 0 }}
                </div>
                <div class="stat-label">Üye</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
      }

      .loading-text {
        margin-top: 16px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.6);
      }

      .project-detail-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .header-card {
        margin-bottom: 24px;
        border-radius: 8px;
        box-shadow: var(--card-shadow);
        overflow: hidden;
        background-color: var(--surface-color);
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        background: linear-gradient(
          to right,
          var(--background-primary),
          var(--background-secondary)
        );
        border-bottom: 1px solid var(--border-color);
      }

      .title-section {
        display: flex;
        align-items: center;
        gap: 16px;

        h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 500;
          color: #333;
        }
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      .action-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 0 16px;
        height: 36px;
        min-width: 100px;
        font-weight: 500;
      }

      .action-button .mat-icon {
        font-size: 20px;
        height: 20px;
        width: 20px;
        margin-right: 4px;
      }

      .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }

      .info-card,
      .members-card,
      .stats-card {
        border-radius: 8px;
        box-shadow: var(--card-shadow);
        overflow: hidden;
        height: 100%;
        background-color: var(--surface-color);
      }

      mat-card-header {
        background-color: var(--background-primary);
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
      }

      mat-card-title {
        margin: 0 !important;
        font-size: 18px !important;
        font-weight: 500 !important;
      }

      mat-card-content {
        padding: 16px;
      }

      .empty-members {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px 16px;
        text-align: center;
        color: rgba(0, 0, 0, 0.5);
      }

      .empty-members mat-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .empty-members p {
        margin-bottom: 16px;
        font-size: 16px;
      }

      .member-item {
        margin-bottom: 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .member-item:hover {
        background-color: var(--hover-color);
      }

      .member-avatar {
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .member-name {
        font-weight: 500;
      }

      .remove-button {
        opacity: 0.6;
        transition: opacity 0.2s;
      }

      .member-item:hover .remove-button {
        opacity: 1;
      }

      .info-item {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
        padding: 12px;
        border-radius: 8px;
        transition: background-color 0.2s;
      }

      .info-item:hover {
        background-color: var(--hover-color);
      }

      .info-item mat-icon {
        color: #3f51b5 !important;
        margin-top: 4px;
        font-size: 24px !important;
        height: 24px !important;
        width: 24px !important;
      }

      .info-content {
        flex: 1;

        strong {
          display: block;
          margin-bottom: 8px;
          color: rgba(0, 0, 0, 0.7);
          font-size: 16px;
          font-weight: 500;
        }

        p {
          margin: 0;
          font-size: 15px;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.8);
        }
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        text-align: center;
      }

      .stat-item {
        padding: 16px;
        background: var(--background-primary);
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: default;
      }

      .stat-item:hover {
        transform: translateY(-2px);
        box-shadow: var(--card-shadow);
      }

      .stat-value {
        font-size: 28px;
        font-weight: 500;
        color: var(--primary-color, #3f51b5);
        margin-bottom: 8px;
      }

      .stat-label {
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* Durum çipleri için stiller */
      .status-active {
        background-color: #4caf50 !important;
        color: white !important;
      }

      .status-onhold {
        background-color: #ff9800 !important;
        color: white !important;
      }

      .status-planned {
        background-color: #2196f3 !important;
        color: white !important;
      }

      .status-completed {
        background-color: #9c27b0 !important;
        color: white !important;
      }

      .status-cancelled {
        background-color: #f44336 !important;
        color: white !important;
      }

      @media (max-width: 600px) {
        .project-header {
          flex-direction: column;
          gap: 16px;
        }

        .actions {
          width: 100%;
          flex-wrap: wrap;
          justify-content: center;
        }
      }
    `,
  ],
})
export class ProjectDetailComponent implements OnInit {
  // Enum'ları template'te kullanabilmek için
  ProjectStatus = ProjectStatus;
  ProjectRole = ProjectRole;

  project?: Project;
  todoCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  isLoading = true;

  // Mevcut kullanıcının rolü
  currentUserRole: ProjectRole = ProjectRole.Viewer; // Varsayılan olarak Viewer

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private roleService: RoleService,
    public avatarService: AvatarService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id") || "0";
    this.loadProject(id);
    this.loadTaskStats();
  }

  loadProject(id: string) {
    this.isLoading = true;
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        if (project) {
          this.project = project;
          console.log("Proje yüklendi:", project);

          // Mevcut kullanıcının rolünü al
          if (project.currentUserRole !== undefined) {
            this.currentUserRole = project.currentUserRole;
            console.log("Kullanıcı rolü:", this.currentUserRole);
          } else {
            // Eğer rol yoksa, API'den al
            this.projectService.getCurrentUserRole(id).subscribe({
              next: (role) => {
                this.currentUserRole = role;
                console.log(
                  "API'den alınan kullanıcı rolü:",
                  this.currentUserRole
                );
              },
              error: (error) => {
                console.error("Kullanıcı rolü alınırken hata oluştu:", error);
                // Hata durumunda varsayılan rol kullan
                this.currentUserRole = ProjectRole.Viewer;
              },
            });
          }

          // API'den gelen durum değerini kontrol et ve göster
          console.log(
            "Proje durumu:",
            project.status,
            "Tip:",
            typeof project.status,
            "Görünen metin:",
            this.getStatusText(project.status)
          );
        } else {
          this.snackBar.open("Proje bulunamadı", "Kapat", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          });
          this.router.navigate(["/projects"]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Proje yüklenirken hata oluştu:", error);
        this.snackBar.open("Proje yüklenirken bir hata oluştu", "Kapat", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
          panelClass: ["error-snackbar"],
        });
        this.router.navigate(["/projects"]);
        this.isLoading = false;
      },
    });
  }

  editProject() {
    if (this.project) {
      this.router.navigate(["/projects", this.project.id, "edit"]);
    }
  }

  toggleStatus() {
    if (this.project) {
      // Mevcut duruma göre yeni durumu belirle
      let newStatus: string | number;
      let statusText: string;

      if (typeof this.project.status === "number") {
        // Enum değeri olarak gelmişse
        newStatus = this.project.status === 1 ? 3 : 1; // InProgress (1) <-> OnHold (3)
        statusText = newStatus === 1 ? "Aktif" : "Beklemede";
      } else {
        // String olarak gelmişse
        newStatus = this.project.status === "ACTIVE" ? "ON_HOLD" : "ACTIVE";
        statusText = newStatus === "ACTIVE" ? "Aktif" : "Beklemede";
      }

      this.projectService
        .updateProjectStatus(this.project.id, newStatus)
        .subscribe({
          next: () => {
            if (this.project) {
              this.project.status = newStatus as any;
              console.log("Proje durumu güncellendi:", newStatus);
              this.snackBar.open(
                `Proje durumu '${statusText}' olarak güncellendi`,
                "Kapat",
                {
                  duration: 3000,
                  horizontalPosition: "center",
                  verticalPosition: "bottom",
                }
              );
            }
          },
          error: (error) => {
            console.error("Proje durumu güncellenirken hata oluştu:", error);
            this.snackBar.open(
              "Proje durumu güncellenirken bir hata oluştu",
              "Kapat",
              {
                duration: 3000,
                horizontalPosition: "center",
                verticalPosition: "bottom",
                panelClass: ["error-snackbar"],
              }
            );
          },
        });
    }
  }

  addMember() {
    console.log("Dialog açılıyor...");
    if (this.dialog.openDialogs.length > 0) {
      console.log("Dialog zaten açık!");
      return;
    }

    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: "400px",
      data: { currentMembers: this.project?.members || [] },
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((memberId: number) => {
        console.log("Dialog kapandı, seçilen üye:", memberId);
        if (memberId && this.project) {
          if (this.project.members && this.project.members.includes(memberId)) {
            console.log("Bu üye zaten ekli!");
            this.snackBar.open("Bu üye zaten projeye ekli", "Kapat", {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "bottom",
            });
            return;
          }

          console.log("Üye ekleniyor:", memberId);
          this.projectService
            .addMember(this.project.id, memberId)
            .pipe(take(1))
            .subscribe({
              next: () => {
                console.log("Üye başarıyla eklendi");
                if (this.project) {
                  // Eğer members dizisi yoksa oluştur
                  if (!this.project.members) {
                    this.project.members = [];
                  }
                  this.project.members = [...this.project.members, memberId];

                  // TeamMembersCount'u güncelle
                  if (this.project.teamMembersCount !== undefined) {
                    this.project.teamMembersCount++;
                  } else {
                    this.project.teamMembersCount = 1;
                  }

                  this.snackBar.open("Üye başarıyla eklendi", "Kapat", {
                    duration: 3000,
                    horizontalPosition: "center",
                    verticalPosition: "bottom",
                  });
                }
              },
              error: (error) => {
                console.error("Üye eklenirken hata oluştu:", error);
                this.snackBar.open("Üye eklenirken bir hata oluştu", "Kapat", {
                  duration: 3000,
                  horizontalPosition: "center",
                  verticalPosition: "bottom",
                  panelClass: ["error-snackbar"],
                });
              },
            });
        }
      });
  }

  removeMember(memberId: number) {
    if (this.project) {
      this.projectService.removeMember(this.project.id, memberId).subscribe({
        next: () => {
          if (this.project) {
            // Members dizisini güncelle
            if (this.project.members) {
              this.project.members = this.project.members.filter(
                (id) => id !== memberId
              );
            }

            // TeamMembersCount'u güncelle
            if (
              this.project.teamMembersCount !== undefined &&
              this.project.teamMembersCount > 0
            ) {
              this.project.teamMembersCount--;
            }

            this.snackBar.open("Üye projeden çıkarıldı", "Kapat", {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "bottom",
            });
          }
        },
        error: (error) => {
          console.error("Üye silinirken hata oluştu:", error);
          this.snackBar.open("Üye çıkarılırken bir hata oluştu", "Kapat", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: ["error-snackbar"],
          });
        },
      });
    }
  }

  loadTaskStats() {
    if (this.project) {
      this.taskService
        .getTasksByProject(this.project.id.toString())
        .subscribe((tasks) => {
          this.todoCount = tasks.filter((t) => t.status === "TODO").length;
          this.inProgressCount = tasks.filter(
            (t) => t.status === "IN_PROGRESS"
          ).length;
          this.completedCount = tasks.filter((t) => t.status === "DONE").length;
        });
    }
  }

  // Durum metinlerini ve renklerini belirleyen yardımcı metotlar
  getStatusText(status: ProjectStatus | string | number): string {
    if (typeof status === "string") {
      switch (status) {
        case "ACTIVE":
          return "Aktif";
        case "ON_HOLD":
          return "Beklemede";
        case "COMPLETED":
          return "Tamamlandı";
        case "PLANNED":
          return "Planlandı";
        default:
          return status;
      }
    } else if (typeof status === "number") {
      // Enum değeri sayı olarak gelirse
      switch (status) {
        case 1: // InProgress
          return "Aktif";
        case 3: // OnHold
          return "Beklemede";
        case 2: // Completed
          return "Tamamlandı";
        case 0: // NotStarted
          return "Planlandı";
        case 4: // Cancelled
          return "İptal Edildi";
        default:
          return "Bilinmiyor";
      }
    } else {
      // ProjectStatus enum değeri
      switch (status) {
        case ProjectStatus.InProgress:
          return "Aktif";
        case ProjectStatus.OnHold:
          return "Beklemede";
        case ProjectStatus.Completed:
          return "Tamamlandı";
        case ProjectStatus.NotStarted:
          return "Planlandı";
        case ProjectStatus.Cancelled:
          return "İptal Edildi";
        default:
          return "Bilinmiyor";
      }
    }
  }

  getStatusColor(status: ProjectStatus | string | number): string {
    return this.isActiveStatus(status) ? "primary" : "warn";
  }

  isActiveStatus(status: ProjectStatus | string | number): boolean {
    if (typeof status === "string") {
      return status === "ACTIVE";
    } else if (typeof status === "number") {
      return status === 1; // ProjectStatus.InProgress
    } else {
      return status === ProjectStatus.InProgress;
    }
  }

  getStatusClass(status: ProjectStatus | string | number): any {
    if (typeof status === "string") {
      switch (status) {
        case "ACTIVE":
          return { "status-active": true };
        case "ON_HOLD":
          return { "status-onhold": true };
        case "COMPLETED":
          return { "status-completed": true };
        case "PLANNED":
          return { "status-planned": true };
        default:
          return {};
      }
    } else if (typeof status === "number") {
      switch (status) {
        case 1:
          return { "status-active": true }; // InProgress
        case 3:
          return { "status-onhold": true }; // OnHold
        case 2:
          return { "status-completed": true }; // Completed
        case 0:
          return { "status-planned": true }; // NotStarted
        case 4:
          return { "status-cancelled": true }; // Cancelled
        default:
          return {};
      }
    } else {
      switch (status) {
        case ProjectStatus.InProgress:
          return { "status-active": true };
        case ProjectStatus.OnHold:
          return { "status-onhold": true };
        case ProjectStatus.Completed:
          return { "status-completed": true };
        case ProjectStatus.NotStarted:
          return { "status-planned": true };
        case ProjectStatus.Cancelled:
          return { "status-cancelled": true };
        default:
          return {};
      }
    }
  }

  // Proje silme işlemi
  deleteProject() {
    if (!this.project) return;

    const dialogRef = this.dialog.open(DeleteProjectDialogComponent, {
      width: "400px",
      data: { projectName: this.project.title || this.project.name || "Proje" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Kullanıcı silme işlemini onayladı
        this.projectService.deleteProject(this.project!.id).subscribe({
          next: () => {
            this.snackBar.open("Proje başarıyla silindi", "Kapat", {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "bottom",
            });
            this.router.navigate(["/projects"]);
          },
          error: (error) => {
            console.error("Proje silinirken hata oluştu:", error);
            this.snackBar.open("Proje silinirken bir hata oluştu", "Kapat", {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "bottom",
              panelClass: ["error-snackbar"],
            });
          },
        });
      }
    });
  }
}
