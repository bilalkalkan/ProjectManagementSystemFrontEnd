import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Project } from "../../../../core/models/project.model";
import { ProjectService } from "../../services/project.service";
import { AddMemberDialogComponent } from "../add-member-dialog/add-member-dialog.component";
import { take } from "rxjs/operators";
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
  ],
  template: `
    <div class="project-detail-container" *ngIf="project">
      <!-- Üst Bilgi Kartı -->
      <mat-card class="header-card">
        <div class="project-header">
          <div class="title-section">
            <h1>{{ project.title }}</h1>
            <mat-chip-set>
              <mat-chip
                [color]="project.status === 'ACTIVE' ? 'primary' : 'warn'"
              >
                {{ project.status }}
              </mat-chip>
            </mat-chip-set>
          </div>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="editProject()">
              <mat-icon>edit</mat-icon>
              Düzenle
            </button>
            <button mat-raised-button [routerLink]="['board']">
              <mat-icon>dashboard</mat-icon>
              Görev Tahtası
            </button>
            <button
              mat-raised-button
              [color]="project.status === 'ACTIVE' ? 'warn' : 'primary'"
              (click)="toggleStatus()"
            >
              <mat-icon>{{
                project.status === "ACTIVE" ? "pause" : "play_arrow"
              }}</mat-icon>
              {{ project.status === "ACTIVE" ? "Pasife Al" : "Aktif Et" }}
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
                <strong>Bitiş Tarihi</strong>
                <p>{{ project.dueDate | date }}</p>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>trending_up</mat-icon>
              <div class="info-content">
                <strong>İlerleme</strong>
                <mat-progress-bar
                  mode="determinate"
                  [value]="project.progress"
                  [color]="project.status === 'ACTIVE' ? 'primary' : 'warn'"
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
              <button mat-icon-button color="primary" (click)="addMember()">
                <mat-icon>person_add</mat-icon>
              </button>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let memberId of project.members">
                <img
                  matListItemAvatar
                  [src]="avatarService.getAvatarUrl(memberId)"
                  [alt]="'Üye #' + memberId"
                />
                <div matListItemTitle>Üye #{{ memberId }}</div>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="removeMember(memberId)"
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
                <div class="stat-value">{{ project.members.length }}</div>
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
      .project-detail-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .header-card {
        margin-bottom: 24px;
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
      }

      .title-section {
        display: flex;
        align-items: center;
        gap: 16px;

        h1 {
          margin: 0;
          font-size: 24px;
        }
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }

      .info-item {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
      }

      .info-content {
        flex: 1;

        strong {
          display: block;
          margin-bottom: 4px;
          color: rgba(0, 0, 0, 0.6);
        }

        p {
          margin: 0;
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
        background: #f5f5f5;
        border-radius: 8px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 500;
        color: var(--primary-color);
      }

      .stat-label {
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
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
  project?: Project;
  todoCount = 0;
  inProgressCount = 0;
  completedCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService,
    private dialog: MatDialog,
    public avatarService: AvatarService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.loadProject(id);
    this.loadTaskStats();
  }

  loadProject(id: number) {
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        if (project) {
          this.project = project;
        } else {
          this.router.navigate(["/projects"]);
        }
      },
      error: (error) => {
        console.error("Proje yüklenirken hata oluştu:", error);
        this.router.navigate(["/projects"]);
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
      const newStatus = this.project.status === "ACTIVE" ? "ON_HOLD" : "ACTIVE";
      this.projectService
        .updateProjectStatus(this.project.id, newStatus)
        .subscribe({
          next: () => {
            if (this.project) {
              this.project.status = newStatus;
            }
          },
          error: (error) => {
            console.error("Proje durumu güncellenirken hata oluştu:", error);
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
          if (this.project.members.includes(memberId)) {
            console.log("Bu üye zaten ekli!");
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
                  this.project.members = [...this.project.members, memberId];
                }
              },
              error: (error) => {
                console.error("Üye eklenirken hata oluştu:", error);
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
            this.project.members = this.project.members.filter(
              (id) => id !== memberId
            );
          }
        },
        error: (error) => {
          console.error("Üye silinirken hata oluştu:", error);
        },
      });
    }
  }

  loadTaskStats() {
    if (this.project) {
      this.taskService.getProjectTasks(this.project.id).subscribe((tasks) => {
        this.todoCount = tasks.filter((t) => t.status === "TODO").length;
        this.inProgressCount = tasks.filter(
          (t) => t.status === "IN_PROGRESS"
        ).length;
        this.completedCount = tasks.filter((t) => t.status === "DONE").length;
      });
    }
  }
}
