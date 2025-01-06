import { Component, OnInit } from "@angular/core";
import { TaskService, Task } from "../../services/task.service";

@Component({
  selector: "app-task-list",
  template: `
    <div class="task-list-container">
      <div class="task-header">
        <div class="task-title">
          <h1>Görevler</h1>
          <span class="task-count">{{ tasks.length }} görev</span>
        </div>
        <div class="header-actions">
          <div class="view-actions">
            <button
              mat-button
              [routerLink]="['/tasks']"
              routerLinkActive="active"
            >
              <mat-icon>list</mat-icon>
              Liste
            </button>
            <button
              mat-button
              [routerLink]="['/tasks/board']"
              routerLinkActive="active"
            >
              <mat-icon>view_kanban</mat-icon>
              Kanban
            </button>
            <button
              mat-button
              [routerLink]="['/tasks/gantt']"
              routerLinkActive="active"
            >
              <mat-icon>timeline</mat-icon>
              Gantt
            </button>
          </div>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Görev Ara</mat-label>
            <input matInput placeholder="Görev adı veya açıklama..." />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="addNewTask()">
            <mat-icon>add</mat-icon>
            Yeni Görev
          </button>
        </div>
      </div>

      <mat-table [dataSource]="tasks" class="task-table">
        <!-- Title Column -->
        <ng-container matColumnDef="title">
          <mat-header-cell *matHeaderCellDef>Başlık</mat-header-cell>
          <mat-cell *matCellDef="let task">{{ task.title }}</mat-cell>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef>Durum</mat-header-cell>
          <mat-cell *matCellDef="let task">
            <mat-chip [color]="getStatusColor(task.status)">
              {{ task.status }}
            </mat-chip>
          </mat-cell>
        </ng-container>

        <!-- Priority Column -->
        <ng-container matColumnDef="priority">
          <mat-header-cell *matHeaderCellDef>Öncelik</mat-header-cell>
          <mat-cell *matCellDef="let task">
            <mat-icon [color]="getPriorityColor(task.priority)">
              {{ getPriorityIcon(task.priority) }}
            </mat-icon>
            {{ task.priority }}
          </mat-cell>
        </ng-container>

        <!-- Assignee Column -->
        <ng-container matColumnDef="assignee">
          <mat-header-cell *matHeaderCellDef>Atanan</mat-header-cell>
          <mat-cell *matCellDef="let task">{{ task.assignee }}</mat-cell>
        </ng-container>

        <!-- Due Date Column -->
        <ng-container matColumnDef="dueDate">
          <mat-header-cell *matHeaderCellDef>Bitiş Tarihi</mat-header-cell>
          <mat-cell *matCellDef="let task">{{ task.dueDate | date }}</mat-cell>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>İşlemler</mat-header-cell>
          <mat-cell *matCellDef="let task">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="editTask(task)">
                <mat-icon>edit</mat-icon>
                <span>Düzenle</span>
              </button>
              <button mat-menu-item (click)="deleteTask(task)">
                <mat-icon color="warn">delete</mat-icon>
                <span>Sil</span>
              </button>
            </mat-menu>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </mat-table>
    </div>
  `,
  styles: [
    `
      .task-list-container {
        padding: 24px;
      }

      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .task-title {
        h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 500;
        }
        .task-count {
          color: #666;
          font-size: 14px;
        }
      }

      .header-actions {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .view-actions {
        display: flex;
        gap: 8px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        padding: 4px;

        button.active {
          background: rgba(0, 0, 0, 0.04);
        }
      }

      .search-field {
        width: 300px;
      }

      .task-table {
        width: 100%;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        .mat-column-title {
          flex: 2;
        }

        .mat-column-actions {
          width: 80px;
          justify-content: flex-end;
        }
      }
    `,
  ],
  standalone: false,
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns = [
    "title",
    "status",
    "priority",
    "assignee",
    "dueDate",
    "actions",
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "TODO":
        return "primary";
      case "IN_PROGRESS":
        return "accent";
      case "DONE":
        return "warn";
      default:
        return "";
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case "HIGH":
        return "warn";
      case "MEDIUM":
        return "accent";
      case "LOW":
        return "primary";
      default:
        return "";
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case "HIGH":
        return "arrow_upward";
      case "MEDIUM":
        return "remove";
      case "LOW":
        return "arrow_downward";
      default:
        return "";
    }
  }

  addNewTask() {
    // TODO: Implement add task dialog
  }

  editTask(task: Task) {
    // TODO: Implement edit task dialog
  }

  deleteTask(task: Task) {
    // TODO: Implement delete confirmation dialog
  }

  updateStatus(task: Task, status: "TODO" | "IN_PROGRESS" | "DONE") {
    this.taskService.updateTask({ ...task, status }).subscribe(() => {
      this.loadTasks();
    });
  }
}
