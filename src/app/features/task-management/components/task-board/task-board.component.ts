import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TaskService, Task } from "../../services/task.service";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../../project-management/services/project.service";
import { Project } from "../../../../core/models/project.model";
import { AvatarService } from "../../../../core/services/avatar.service";

@Component({
  selector: "app-task-board",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule,
  ],
  template: `
    <div class="board-container">
      <div class="board-header">
        <h2>{{ project?.title }} - Görev Tahtası</h2>
        <button
          mat-raised-button
          color="primary"
          [routerLink]="['/projects', projectId, 'tasks', 'new']"
          [queryParams]="{ projectId: projectId }"
        >
          <mat-icon>add</mat-icon>
          Yeni Görev
        </button>
      </div>

      <div class="board-columns">
        <!-- TODO Kolonu -->
        <div class="board-column">
          <div class="column-header">
            <h3>Yapılacak</h3>
            <span class="task-count">{{ todoTasks.length }}</span>
          </div>
          <div
            cdkDropList
            id="todo"
            #todoList="cdkDropList"
            [cdkDropListData]="todoTasks"
            [cdkDropListConnectedTo]="['inProgress', 'done']"
            (cdkDropListDropped)="drop($event)"
            class="task-list"
          >
            <mat-card
              *ngFor="let task of todoTasks"
              cdkDrag
              class="task-card"
              [class.high-priority]="task.priority === 'HIGH'"
            >
              <mat-card-header>
                <mat-card-title>{{ task.title }}</mat-card-title>
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </mat-card-header>
              <mat-card-content>
                <p>{{ task.description }}</p>
                <div class="task-meta">
                  <span class="due-date">
                    <mat-icon>event</mat-icon>
                    {{ task.dueDate | date }}
                  </span>
                  <span class="assignee" *ngIf="task.assignee">
                    <img
                      *ngIf="task.assignee"
                      [src]="avatarService.getAvatarUrl(task.assignee.id)"
                      [alt]="task.assignee.name"
                      class="avatar"
                    />
                  </span>
                </div>
              </mat-card-content>
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editTask(task)">
                  <mat-icon>edit</mat-icon>
                  <span>Düzenle</span>
                </button>
                <button mat-menu-item (click)="deleteTask(task)">
                  <mat-icon>delete</mat-icon>
                  <span>Sil</span>
                </button>
              </mat-menu>
            </mat-card>
          </div>
        </div>

        <!-- IN_PROGRESS Kolonu -->
        <div class="board-column">
          <div class="column-header">
            <h3>Devam Ediyor</h3>
            <span class="task-count">{{ inProgressTasks.length }}</span>
          </div>
          <div
            cdkDropList
            id="inProgress"
            #inProgressList="cdkDropList"
            [cdkDropListData]="inProgressTasks"
            [cdkDropListConnectedTo]="['todo', 'done']"
            (cdkDropListDropped)="drop($event)"
            class="task-list"
          >
            <mat-card
              *ngFor="let task of inProgressTasks"
              cdkDrag
              class="task-card"
              [class.high-priority]="task.priority === 'HIGH'"
            >
              <mat-card-header>
                <mat-card-title>{{ task.title }}</mat-card-title>
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </mat-card-header>
              <mat-card-content>
                <p>{{ task.description }}</p>
                <div class="task-meta">
                  <span class="due-date">
                    <mat-icon>event</mat-icon>
                    {{ task.dueDate | date }}
                  </span>
                  <span class="assignee" *ngIf="task.assignee">
                    <img
                      *ngIf="task.assignee"
                      [src]="avatarService.getAvatarUrl(task.assignee.id)"
                      [alt]="task.assignee.name"
                      class="avatar"
                    />
                  </span>
                </div>
              </mat-card-content>
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editTask(task)">
                  <mat-icon>edit</mat-icon>
                  <span>Düzenle</span>
                </button>
                <button mat-menu-item (click)="deleteTask(task)">
                  <mat-icon>delete</mat-icon>
                  <span>Sil</span>
                </button>
              </mat-menu>
            </mat-card>
          </div>
        </div>

        <!-- DONE Kolonu -->
        <div class="board-column">
          <div class="column-header">
            <h3>Tamamlandı</h3>
            <span class="task-count">{{ doneTasks.length }}</span>
          </div>
          <div
            cdkDropList
            id="done"
            #doneList="cdkDropList"
            [cdkDropListData]="doneTasks"
            [cdkDropListConnectedTo]="['todo', 'inProgress']"
            (cdkDropListDropped)="drop($event)"
            class="task-list"
          >
            <mat-card
              *ngFor="let task of doneTasks"
              cdkDrag
              class="task-card"
              [class.high-priority]="task.priority === 'HIGH'"
            >
              <mat-card-header>
                <mat-card-title>{{ task.title }}</mat-card-title>
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </mat-card-header>
              <mat-card-content>
                <p>{{ task.description }}</p>
                <div class="task-meta">
                  <span class="due-date">
                    <mat-icon>event</mat-icon>
                    {{ task.dueDate | date }}
                  </span>
                  <span class="assignee" *ngIf="task.assignee">
                    <img
                      *ngIf="task.assignee"
                      [src]="avatarService.getAvatarUrl(task.assignee.id)"
                      [alt]="task.assignee.name"
                      class="avatar"
                    />
                  </span>
                </div>
              </mat-card-content>
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editTask(task)">
                  <mat-icon>edit</mat-icon>
                  <span>Düzenle</span>
                </button>
                <button mat-menu-item (click)="deleteTask(task)">
                  <mat-icon>delete</mat-icon>
                  <span>Sil</span>
                </button>
              </mat-menu>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .board-container {
        padding: 20px;
        height: calc(100vh - 64px);
        overflow-x: auto;
      }

      .board-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .board-columns {
        display: flex;
        gap: 20px;
        min-height: calc(100% - 60px);
      }

      .board-column {
        flex: 1;
        min-width: 300px;
        background: #f5f5f5;
        border-radius: 4px;
        padding: 10px;
      }

      .column-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .task-count {
        background: #e0e0e0;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 14px;
      }

      .task-list {
        min-height: 100px;
      }

      .task-card {
        margin-bottom: 8px;
        cursor: move;
      }

      .task-card:last-child {
        margin-bottom: 0;
      }

      .task-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
      }

      .avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }

      .high-priority {
        border-left: 4px solid var(--danger-color);
      }

      .medium-priority {
        border-left: 4px solid var(--warning-color);
      }

      .low-priority {
        border-left: 4px solid var(--success-color);
      }

      .cdk-drag-preview {
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-placeholder {
        opacity: 0;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .task-list.cdk-drop-list-dragging .task-card:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class TaskBoardComponent implements OnInit {
  projectId = 0;
  project?: Project;
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  allTasks: Task[] = [];
  searchText = "";
  selectedPriority = "all";

  // Drop listeleri için referanslar
  todoList: any;
  inProgressList: any;
  doneList: any;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    public avatarService: AvatarService
  ) {
    this.projectId = Number(this.route.snapshot.paramMap.get("id"));
  }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get("id"));

    // Proje detaylarını yükle
    this.projectService
      .getProject(this.projectId)
      .subscribe((project) => (this.project = project));

    // Görevleri yükle
    this.loadTasks();

    // Route değişikliklerini dinle
    this.route.params.subscribe(() => {
      this.loadTasks();
    });
  }

  loadTasks() {
    console.log("Görevler yükleniyor, projectId:", this.projectId); // Debug için
    this.taskService.getProjectTasks(this.projectId).subscribe((tasks) => {
      console.log("Gelen görevler:", tasks); // Debug için
      this.allTasks = tasks;
      this.filterTasks();
    });
  }

  filterTasks() {
    this.todoTasks = this.allTasks.filter((task) => task.status === "TODO");
    this.inProgressTasks = this.allTasks.filter(
      (task) => task.status === "IN_PROGRESS"
    );
    this.doneTasks = this.allTasks.filter((task) => task.status === "DONE");
  }

  get completionRate(): number {
    return (
      Math.round((this.doneTasks.length / this.allTasks.length) * 100) || 0
    );
  }

  isOverdue(task: Task): boolean {
    return new Date(task.dueDate) < new Date();
  }

  applyFilters() {
    // Filtreleme otomatik olarak getter'lar aracılığıyla uygulanıyor
  }

  private getListByColumn(column: string): Task[] {
    switch (column) {
      case "todo":
        return this.todoTasks;
      case "inProgress":
        return this.inProgressTasks;
      case "done":
        return this.doneTasks;
      default:
        return [];
    }
  }

  sortColumn(column: string, criteria: "priority" | "dueDate") {
    const list = this.getListByColumn(column);
    if (criteria === "priority") {
      const priorityOrder: Record<string, number> = {
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
      };
      list.sort(
        (a: Task, b: Task) =>
          priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else {
      list.sort(
        (a: Task, b: Task) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    }
  }

  moveTask(task: Task, newStatus: "TODO" | "IN_PROGRESS" | "DONE") {
    this.taskService
      .updateTask(task.id, { ...task, status: newStatus })
      .subscribe(() => {
        this.loadTasks();
      });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      let newStatus: "TODO" | "IN_PROGRESS" | "DONE";

      if (event.container.id === "todo") {
        newStatus = "TODO";
      } else if (event.container.id === "inProgress") {
        newStatus = "IN_PROGRESS";
      } else {
        newStatus = "DONE";
      }

      this.taskService.updateTaskStatus(task.id, newStatus).subscribe(() => {
        this.loadTasks(); // Görevleri yeniden yükle
      });
    }
  }

  editTask(task: Task) {
    // Task düzenleme işlemi
  }

  deleteTask(task: Task) {
    // Task silme işlemi
  }
}
