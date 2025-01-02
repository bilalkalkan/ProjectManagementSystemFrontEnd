import { Component, OnInit } from "@angular/core";
import { TaskService, Task } from "../../services/task.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: "app-task-list",
  template: `
    <div class="task-list-container">
      <!-- Üst Toolbar -->
      <mat-card class="toolbar-card">
        <div class="toolbar-actions">
          <button mat-raised-button color="primary" routerLink="new">
            <mat-icon>add</mat-icon>
            Yeni Görev
          </button>
          <button mat-raised-button routerLink="board">
            <mat-icon>dashboard</mat-icon>
            Kanban Görünümü
          </button>
        </div>

        <!-- Filtreler -->
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Durum</mat-label>
            <mat-select [(ngModel)]="filters.status">
              <mat-option value="all">Tümü</mat-option>
              <mat-option value="TODO">Yapılacak</mat-option>
              <mat-option value="IN_PROGRESS">Devam Ediyor</mat-option>
              <mat-option value="DONE">Tamamlandı</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Öncelik</mat-label>
            <mat-select [(ngModel)]="filters.priority">
              <mat-option value="all">Tümü</mat-option>
              <mat-option value="HIGH">Yüksek</mat-option>
              <mat-option value="MEDIUM">Orta</mat-option>
              <mat-option value="LOW">Düşük</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Ara</mat-label>
            <input
              matInput
              [(ngModel)]="filters.search"
              placeholder="Görev ara..."
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Görev Listesi -->
      <div class="task-grid">
        <mat-card *ngFor="let task of filteredTasks" class="task-card">
          <div class="task-header">
            <div [class]="'priority-badge ' + task.priority.toLowerCase()">
              {{ task.priority }}
            </div>
            <button mat-icon-button [matMenuTriggerFor]="taskMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #taskMenu="matMenu">
              <button mat-menu-item [routerLink]="[task.id]">
                <mat-icon>visibility</mat-icon>
                <span>Detaylar</span>
              </button>
              <button mat-menu-item [routerLink]="[task.id, 'edit']">
                <mat-icon>edit</mat-icon>
                <span>Düzenle</span>
              </button>
              <button mat-menu-item (click)="deleteTask(task.id)">
                <mat-icon color="warn">delete</mat-icon>
                <span>Sil</span>
              </button>
            </mat-menu>
          </div>

          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>

          <div class="task-meta">
            <span class="due-date">
              <mat-icon>event</mat-icon>
              {{ task.dueDate | date }}
            </span>
            <span class="assignee" *ngIf="task.assignee">
              <img [src]="task.assignee.avatar" [alt]="task.assignee.name" />
              {{ task.assignee.name }}
            </span>
          </div>

          <mat-progress-bar
            *ngIf="task.status === 'IN_PROGRESS'"
            mode="determinate"
            [value]="task.progress"
          ></mat-progress-bar>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .task-list-container {
        padding: 24px;
      }

      .toolbar-card {
        margin-bottom: 24px;
        padding: 16px;
      }

      .toolbar-actions {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
      }

      .filters {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .task-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
      }

      .task-card {
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .priority-badge.high {
          background: #ffebee;
          color: #c62828;
        }
        .priority-badge.medium {
          background: #fff3e0;
          color: #ef6c00;
        }
        .priority-badge.low {
          background: #e8f5e9;
          color: #2e7d32;
        }

        h3 {
          margin: 0 0 8px 0;
        }

        p {
          color: rgba(0, 0, 0, 0.6);
          margin: 0 0 16px 0;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          font-size: 0.9rem;
          color: rgba(0, 0, 0, 0.6);

          .due-date,
          .assignee {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }
        }
      }
    `,
  ],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
  ],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filters = {
    status: "all",
    priority: "all",
    search: "",
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesStatus =
        this.filters.status === "all" || task.status === this.filters.status;
      const matchesPriority =
        this.filters.priority === "all" ||
        task.priority === this.filters.priority;
      const matchesSearch =
        !this.filters.search ||
        task.title.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        task.description
          .toLowerCase()
          .includes(this.filters.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }

  deleteTask(id: number) {
    if (confirm("Bu görevi silmek istediğinizden emin misiniz?")) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }
}
