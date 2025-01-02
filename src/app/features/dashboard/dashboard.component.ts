import { Component, OnInit } from "@angular/core";
import { ProjectService } from "../project-management/services/project.service";
import { MatDialog } from "@angular/material/dialog";
import { TimeAgoPipe } from "../../shared/pipes/time-ago.pipe";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatListItemLine, MatListItemMeta } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { AvatarService } from "../../core/services/avatar.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    TimeAgoPipe,
    MatListItemLine,
    MatListItemMeta,
    MatMenuModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="dashboard-container fade-in">
      <!-- Özet Kartları -->
      <div class="summary-cards">
        <mat-card class="summary-card">
          <div class="card-icon primary">
            <mat-icon>folder_special</mat-icon>
          </div>
          <div class="card-content">
            <h3>Aktif Projeler</h3>
            <div class="stat-value">{{ activeProjects }}</div>
            <mat-progress-bar
              mode="determinate"
              [value]="(activeProjects / totalProjects) * 100"
            ></mat-progress-bar>
          </div>
        </mat-card>

        <mat-card class="summary-card">
          <div class="card-icon warning">
            <mat-icon>pending_actions</mat-icon>
          </div>
          <div class="card-content">
            <h3>Bekleyen Görevler</h3>
            <div class="stat-value">{{ pendingTasks }}</div>
            <div class="trend up">
              <mat-icon>trending_up</mat-icon>
              <span>%12 artış</span>
            </div>
          </div>
        </mat-card>


        <mat-card class="summary-card">
          <div class="card-icon success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="card-content">
            <h3>Tamamlanan Görevler</h3>
            <div class="stat-value">{{ completedTasks }}</div>
            <div class="completion-rate">
              <span>Tamamlanma Oranı: %{{ completionRate }}</span>
            </div>
          </div>
        </mat-card>

        <mat-card class="summary-card">
          <div class="card-icon info">
            <mat-icon>group</mat-icon>
          </div>
          <div class="card-content">
            <h3>Aktif Takım Üyeleri</h3>
            <div class="team-avatars">
              <img
                *ngFor="let member of activeTeamMembers"
                [src]="avatarService.getAvatarUrl(member.id)"
                [alt]="member.name"
                [matTooltip]="member.name"
              />
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Aktivite Akışı ve Görevler -->
      <div class="dashboard-grid">
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>update</mat-icon>
              Son Aktiviteler
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let activity of recentActivities">
                <mat-icon [color]="activity.color" matListItemIcon>
                  {{ activity.icon }}
                </mat-icon>
                <div matListItemTitle>{{ activity.title }}</div>
                <div matListItemLine>{{ activity.description }}</div>
                <div matListItemMeta>{{ activity.time | date : "medium" }}</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <mat-card class="tasks-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>assignment</mat-icon>
              Yaklaşan Görevler
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="task-list">
              <div *ngFor="let task of upcomingTasks" class="task-item">
                <div class="task-status" [class]="task.priority"></div>
                <div class="task-content">
                  <h4>{{ task.title }}</h4>
                  <p>{{ task.project }}</p>
                  <div class="task-meta">
                    <span>
                      <mat-icon>event</mat-icon>
                      {{ task.dueDate | date }}
                    </span>
                    <span>
                      <mat-icon>person</mat-icon>
                      {{ task.assignee }}
                    </span>
                  </div>
                </div>
                <button mat-icon-button [matMenuTriggerFor]="taskMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #taskMenu="matMenu">
                  <button mat-menu-item>
                    <mat-icon>done</mat-icon>
                    <span>Tamamlandı</span>
                  </button>
                  <button mat-menu-item>
                    <mat-icon>edit</mat-icon>
                    <span>Düzenle</span>
                  </button>
                </mat-menu>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
        overflow-x: hidden;
      }

      .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-bottom: 24px;
      }

      .summary-card {
        width: 100%;
        box-sizing: border-box;
      }

      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .card-icon.primary {
        background: #e3f2fd;
      }
      .card-icon.warning {
        background: #fff3e0;
      }
      .card-icon.success {
        background: #e8f5e9;
      }
      .card-icon.info {
        background: #e1f5fe;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 500;
        margin: 8px 0;
      }

      .trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.9rem;
      }

      .trend.up {
        color: var(--success-color);
      }
      .trend.down {
        color: var(--danger-color);
      }

      .team-avatars {
        display: flex;
        margin-top: 8px;
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid white;
          margin-left: -8px;
          &:first-child {
            margin-left: 0;
          }
        }
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-bottom: 24px;
      }

      .task-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      }

      .task-status {
        width: 4px;
        height: 100%;
        border-radius: 4px;
      }

      .task-status.high {
        background: var(--danger-color);
      }
      .task-status.medium {
        background: var(--warning-color);
      }
      .task-status.low {
        background: var(--success-color);
      }

      .task-content {
        flex: 1;
        h4 {
          margin: 0 0 4px 0;
        }
        p {
          margin: 0;
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .task-meta {
        display: flex;
        gap: 16px;
        margin-top: 8px;
        font-size: 0.85rem;
        color: rgba(0, 0, 0, 0.6);
        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      /* Mobil için responsive düzenleme */
      @media (max-width: 600px) {
        .dashboard-container {
          padding: 16px;
        }

        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  totalProjects = 0;
  activeProjects = 0;
  pendingTasks = 12;
  completedTasks = 45;
  completionRate = 75;

  activeTeamMembers = [
    { id: 1, name: "Ahmet Yılmaz" },
    { id: 2, name: "Ayşe Demir" },
    { id: 3, name: "Mehmet Kaya" },
  ];

  recentActivities = [
    {
      title: "Yeni görev oluşturuldu",
      description: "E-ticaret projesi - API Entegrasyonu",
      icon: "add_task",
      color: "primary",
      time: new Date(),
    },
  ];

  upcomingTasks = [
    {
      title: "API Entegrasyonu",
      project: "E-ticaret Projesi",
      dueDate: new Date(Date.now() + 86400000),
      assignee: "Ahmet Yılmaz",
      priority: "high",
    },
  ];

  constructor(
    private projectService: ProjectService,
    public avatarService: AvatarService
  ) {}

  ngOnInit() {
    this.loadProjectStats();
  }

  loadProjectStats() {
    this.projectService.getProjects().subscribe((projects) => {
      this.totalProjects = projects.length;
      this.activeProjects = projects.filter(
        (p) => p.status === "ACTIVE"
      ).length;
    });
  }
}
