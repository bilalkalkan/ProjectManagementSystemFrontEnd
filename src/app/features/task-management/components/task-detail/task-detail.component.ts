import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TaskService, Task } from "../../services/task.service";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDividerModule } from "@angular/material/divider";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTabsModule } from "@angular/material/tabs";
import { MatBadgeModule } from "@angular/material/badge";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-task-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatTabsModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="task-detail-container" *ngIf="task">
      <!-- Üst Bilgi Kartı -->
      <mat-card class="task-header-card">
        <div class="header-content">
          <div class="breadcrumb">
            <a routerLink=".." class="back-link">
              <mat-icon>arrow_back</mat-icon>
              Görevler
            </a>
            <mat-icon class="separator">chevron_right</mat-icon>
            <span class="current">Görev Detayı</span>
          </div>

          <div class="title-section">
            <div class="title-row">
              <h1>{{ task.title }}</h1>
              <div class="actions">
                <button
                  mat-stroked-button
                  color="primary"
                  [routerLink]="['edit']"
                >
                  <mat-icon>edit</mat-icon>
                  Düzenle
                </button>
                <button
                  mat-stroked-button
                  color="warn"
                  (click)="deleteTask()"
                  matTooltip="Görevi Sil"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <div class="status-row">
              <mat-chip-set>
                <mat-chip [class]="'status-' + task.status.toLowerCase()">
                  <mat-icon>{{ getStatusIcon(task.status) }}</mat-icon>
                  {{ getStatusText(task.status) }}
                </mat-chip>
                <mat-chip [class]="'priority-' + task.priority.toLowerCase()">
                  <mat-icon>{{ getPriorityIcon(task.priority) }}</mat-icon>
                  {{ task.priority }}
                </mat-chip>
              </mat-chip-set>
            </div>
          </div>
        </div>
      </mat-card>

      <div class="content-grid">
        <!-- Sol Kolon -->
        <div class="main-content">
          <mat-card>
            <mat-tab-group>
              <!-- Detaylar Sekmesi -->
              <mat-tab>
                <ng-template mat-tab-label>
                  <div class="tab-label">
                    <mat-icon>description</mat-icon>
                    <span>Detaylar</span>
                  </div>
                </ng-template>

                <div class="tab-content">
                  <div class="description-section">
                    <div class="section-header">
                      <h2>
                        <mat-icon>subject</mat-icon>
                        Açıklama
                      </h2>
                      <button mat-icon-button color="primary">
                        <mat-icon>edit</mat-icon>
                      </button>
                    </div>
                    <div class="description-content">
                      <p *ngIf="task.description">{{ task.description }}</p>
                      <p *ngIf="!task.description" class="no-content">
                        <mat-icon>info</mat-icon>
                        Henüz açıklama eklenmemiş
                      </p>
                    </div>
                  </div>

                  <mat-divider></mat-divider>

                  <div class="progress-section">
                    <div class="section-header">
                      <h2>
                        <mat-icon>trending_up</mat-icon>
                        İlerleme Durumu
                      </h2>
                    </div>
                    <div class="progress-content">
                      <div class="progress-stats">
                        <div class="progress-value">
                          <span class="value">{{ task.progress }}%</span>
                          <span class="label">Tamamlandı</span>
                        </div>
                        <div class="time-remaining" *ngIf="!isOverdue(task)">
                          <span class="value"
                            >{{ getRemainingDays(task) }} gün</span
                          >
                          <span class="label">Kalan Süre</span>
                        </div>
                      </div>
                      <mat-progress-bar
                        mode="determinate"
                        [value]="task.progress"
                        [class]="getProgressClass(task.progress)"
                      ></mat-progress-bar>
                    </div>
                  </div>
                </div>
              </mat-tab>

              <!-- Aktiviteler Sekmesi -->
              <mat-tab>
                <ng-template mat-tab-label>
                  <div class="tab-label">
                    <mat-icon>history</mat-icon>
                    <span>Aktiviteler</span>
                    <span class="badge">{{ activities.length }}</span>
                  </div>
                </ng-template>

                <div class="tab-content">
                  <div class="activity-list">
                    <div
                      class="activity-item"
                      *ngFor="let activity of activities"
                    >
                      <div
                        class="activity-icon"
                        [ngClass]="getActivityIconClass(activity)"
                      >
                        <mat-icon>{{ activity.icon }}</mat-icon>
                      </div>
                      <div class="activity-content">
                        <p class="activity-text">{{ activity.text }}</p>
                        <span class="activity-time">{{
                          activity.time | date : "medium"
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </mat-tab>

              <!-- Yorumlar Sekmesi -->
              <mat-tab>
                <ng-template mat-tab-label>
                  <div class="tab-label">
                    <mat-icon>comment</mat-icon>
                    <span>Yorumlar</span>
                    <span class="badge">{{ comments.length }}</span>
                  </div>
                </ng-template>

                <div class="tab-content">
                  <div class="comments-section">
                    <div class="comment-form">
                      <img
                        [src]="currentUserAvatar"
                        [alt]="currentUserName"
                        class="user-avatar"
                      />
                      <div class="form-content">
                        <mat-form-field appearance="outline">
                          <mat-label>Yorum ekle...</mat-label>
                          <textarea
                            matInput
                            [(ngModel)]="newComment"
                            placeholder="Düşüncelerinizi paylaşın..."
                            rows="2"
                          ></textarea>
                        </mat-form-field>
                        <button
                          mat-raised-button
                          color="primary"
                          [disabled]="!newComment"
                          (click)="addComment()"
                        >
                          <mat-icon>send</mat-icon>
                          Gönder
                        </button>
                      </div>
                    </div>

                    <div class="comments-list">
                      <div class="comment" *ngFor="let comment of comments">
                        <img
                          [src]="comment.avatar"
                          [alt]="comment.author"
                          class="comment-avatar"
                        />
                        <div class="comment-content">
                          <div class="comment-header">
                            <span class="author">{{ comment.author }}</span>
                            <span class="time">{{
                              comment.time | date : "medium"
                            }}</span>
                          </div>
                          <p class="text">{{ comment.text }}</p>
                          <div class="comment-actions">
                            <button mat-button color="primary">
                              <mat-icon>thumb_up</mat-icon>
                              Beğen
                            </button>
                            <button mat-button>
                              <mat-icon>reply</mat-icon>
                              Yanıtla
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </mat-tab>
            </mat-tab-group>
          </mat-card>
        </div>

        <!-- Sağ Kolon -->
        <div class="side-content">
          <mat-card class="info-card">
            <h2>Görev Bilgileri</h2>

            <div class="info-list">
              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div class="info-content">
                  <span class="label">Oluşturulma</span>
                  <span class="value">{{ task.dueDate | date }}</span>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>schedule</mat-icon>
                <div class="info-content">
                  <span class="label">Son Tarih</span>
                  <span class="value" [class.overdue]="isOverdue(task)">
                    {{ task.dueDate | date }}
                    <span *ngIf="isOverdue(task)" class="overdue-badge">
                      Gecikmiş
                    </span>
                  </span>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="info-item" *ngIf="task.assignee">
                <mat-icon>person</mat-icon>
                <div class="info-content">
                  <span class="label">Atanan Kişi</span>
                  <div class="assignee">
                    <img
                      [src]="task.assignee.avatar"
                      [alt]="task.assignee.name"
                      class="assignee-avatar"
                    />
                    <span class="assignee-name">{{ task.assignee.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card>

          <mat-card class="related-tasks-card">
            <h2>İlgili Görevler</h2>
            <div class="related-tasks-list">
              <div class="related-task" *ngFor="let related of relatedTasks">
                <div class="task-status">
                  <mat-icon [class]="'status-' + related.status.toLowerCase()">
                    {{ getStatusIcon(related.status) }}
                  </mat-icon>
                </div>
                <div class="task-info">
                  <span class="task-title">{{ related.title }}</span>
                  <span class="task-meta">{{ related.dueDate | date }}</span>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: linear-gradient(135deg, #f6f9fc 0%, #ecf3f8 100%);
        position: relative;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          transform: skewY(-3deg);
          transform-origin: 0;
          z-index: 0;
        }
      }

      .task-detail-container {
        position: relative;
        z-index: 1;
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .task-header-card {
        margin-bottom: 24px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.7);

        .header-content {
          padding: 24px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          color: #64748b;

          .back-link {
            font-weight: 500;
            font-size: 14px;
            color: #64748b;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: color 0.2s;

            &:hover {
              color: #3b82f6;
            }

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
            }
          }

          .separator {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }

          .current {
            font-weight: 500;
            color: #94a3b8;
          }
        }

        .title-section {
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.8)
          );
          padding: 20px;
          border-radius: 12px;
          margin: 16px 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

          .title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;

            h1 {
              font-size: 28px;
              font-weight: 600;
              color: #1e293b;
              letter-spacing: -0.5px;
              margin: 0;
            }

            .actions {
              display: flex;
              gap: 8px;
            }
          }
        }
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 24px;
        margin-top: -60px;

        .main-content {
          mat-card {
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.7);
            overflow: hidden;

            ::ng-deep {
              .mat-mdc-tab-header {
                background: rgba(255, 255, 255, 0.95);
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
              }

              .mat-mdc-tab-body-content {
                background: rgba(255, 255, 255, 0.7);
              }
            }
          }
        }

        .side-content {
          .info-card,
          .related-tasks-card {
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.7);
            padding: 24px;
            margin-bottom: 24px;

            .info-list {
              .info-item {
                background: rgba(255, 255, 255, 0.7);
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 8px;

                .label {
                  font-size: 12px;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  color: #64748b;
                  margin-bottom: 4px;
                }

                .value {
                  font-size: 14px;
                  color: #334155;
                  font-weight: 500;

                  &.overdue {
                    color: #ef4444;
                    font-weight: 600;
                  }
                }
              }
            }

            .related-tasks-list {
              .related-task {
                padding: 12px;
                border-radius: 8px;

                .task-title {
                  font-weight: 500;
                  color: #334155;
                  margin-bottom: 4px;
                }

                .task-meta {
                  font-size: 12px;
                  color: #64748b;
                }
              }
            }
          }
        }
      }

      .status-todo {
        background: #fef3c7 !important;
        color: #92400e !important;
      }

      .status-in_progress {
        background: #dbeafe !important;
        color: #1e40af !important;
      }

      .status-done {
        background: #d1fae5 !important;
        color: #065f46 !important;
      }

      .priority-high {
        background: #fee2e2 !important;
        color: #991b1b !important;
      }

      .priority-medium {
        background: #fff7ed !important;
        color: #9a3412 !important;
      }

      .priority-low {
        background: #f0fdf4 !important;
        color: #166534 !important;
      }

      .progress-low {
        color: #ef4444 !important;
      }
      .progress-medium {
        color: #f59e0b !important;
      }
      .progress-high {
        color: #10b981 !important;
      }

      mat-chip-set {
        .mdc-evolution-chip {
          font-weight: 500 !important;
          letter-spacing: 0.3px;
          height: 28px;
          font-size: 13px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }
        }
      }

      .activity-list,
      .comments-list {
        .activity-item,
        .comment {
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.8)
          );
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.7);

          .activity-text,
          .text {
            font-size: 14px;
            line-height: 1.6;
            color: #334155;
            margin-bottom: 4px;
          }

          .activity-time,
          .time {
            font-size: 12px;
            color: #64748b;
          }

          .author {
            font-weight: 600;
            color: #1e293b;
          }
        }
      }

      ::ng-deep {
        .mat-mdc-tab {
          min-width: 120px;
          padding: 0 24px;
          height: 48px;
          font-weight: 500;
          letter-spacing: 0.3px;

          .mat-mdc-tab-label-content {
            font-size: 14px;
          }
        }

        .mat-mdc-tab-header {
          margin-bottom: 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
      }

      .tab-label {
        display: flex;
        align-items: center;
        gap: 8px;

        .badge {
          background: #3b82f6;
          color: white;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          min-width: 20px;
          text-align: center;
        }
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          font-size: 18px;
          color: #1e293b;

          mat-icon {
            color: #64748b;
          }
        }
      }

      .description-content {
        background: #f8fafc;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;

        p {
          margin: 0;
          line-height: 1.6;
          color: #334155;
        }

        .no-content {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-style: italic;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }
      }

      .progress-content {
        .progress-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;

          .progress-value,
          .time-remaining {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 12px;
            background: #f8fafc;
            border-radius: 8px;
            min-width: 100px;

            .value {
              font-size: 24px;
              font-weight: 600;
              color: #1e293b;
            }

            .label {
              font-size: 12px;
              color: #64748b;
              margin-top: 4px;
            }
          }
        }
      }

      .activity-item {
        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          &.edit {
            background: #dbeafe;
            color: #2563eb;
          }
          &.add {
            background: #dcfce7;
            color: #16a34a;
          }
          &.delete {
            background: #fee2e2;
            color: #dc2626;
          }
          &.update {
            background: #fef3c7;
            color: #d97706;
          }
        }
      }

      .comment-form {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .form-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;

          mat-form-field {
            width: 100%;
          }

          button {
            align-self: flex-end;
          }
        }
      }
    `,
  ],
})
export class TaskDetailComponent implements OnInit {
  task?: Task;
  activities = [
    {
      icon: "edit",
      text: "Görev durumu güncellendi: 'Devam Ediyor'",
      time: new Date(Date.now() - 3600000),
    },
    {
      icon: "person_add",
      text: "Ahmet Yılmaz göreve atandı",
      time: new Date(Date.now() - 7200000),
    },
  ];

  comments = [
    {
      author: "Ahmet Yılmaz",
      avatar: "assets/avatars/1.jpg",
      text: "API dokümantasyonu hazırlandı, review'a hazır.",
      time: new Date(Date.now() - 3600000),
    },
    {
      author: "Ayşe Demir",
      avatar: "assets/avatars/2.jpg",
      text: "Endpoint'leri test ettim, birkaç küçük düzeltme gerekiyor.",
      time: new Date(Date.now() - 7200000),
    },
  ];

  relatedTasks = [
    {
      title: "API Endpoint'lerinin Oluşturulması",
      status: "IN_PROGRESS",
      dueDate: new Date(Date.now() + 86400000),
    },
    {
      title: "Veritabanı Şemasının Tasarlanması",
      status: "DONE",
      dueDate: new Date(Date.now() - 86400000),
    },
  ];

  newComment = "";
  currentUserAvatar = "assets/avatars/current-user.jpg";
  currentUserName = "Mevcut Kullanıcı";

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (id) {
      this.taskService.getTask(id).subscribe((task) => {
        this.task = task;
      });
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "TODO":
        return "assignment";
      case "IN_PROGRESS":
        return "pending";
      case "DONE":
        return "check_circle";
      default:
        return "help";
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "TODO":
        return "Yapılacak";
      case "IN_PROGRESS":
        return "Devam Ediyor";
      case "DONE":
        return "Tamamlandı";
      default:
        return status;
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case "HIGH":
        return "priority_high";
      case "MEDIUM":
        return "drag_handle";
      case "LOW":
        return "low_priority";
      default:
        return "help";
    }
  }

  getProgressClass(progress: number): string {
    if (progress < 30) return "progress-low";
    if (progress < 70) return "progress-medium";
    return "progress-high";
  }

  isOverdue(task: Task): boolean {
    return new Date(task.dueDate) < new Date();
  }

  deleteTask() {
    if (this.task && confirm("Bu görevi silmek istediğinizden emin misiniz?")) {
      this.taskService.deleteTask(this.task.id).subscribe(() => {
        // Görev listesine geri dön
      });
    }
  }

  getActivityIconClass(activity: any): string {
    switch (activity.icon) {
      case "edit":
        return "edit";
      case "person_add":
        return "add";
      case "delete":
        return "delete";
      default:
        return "update";
    }
  }

  getRemainingDays(task: Task): number {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  addComment() {
    if (this.newComment.trim()) {
      this.comments.unshift({
        author: this.currentUserName,
        avatar: this.currentUserAvatar,
        text: this.newComment,
        time: new Date(),
      });
      this.newComment = "";
    }
  }
}
