import { Component, OnInit } from "@angular/core";
import { TaskService, Task } from "../../services/task.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-task-gantt",
  template: `
    <div class="gantt-container">
      <div class="task-header">
        <div class="task-title">
          <h1>Gantt Görünümü</h1>
        </div>
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
      </div>

      <div class="gantt-chart">
        <div class="timeline-header">
          <!-- Zaman çizelgesi başlıkları -->
          <div class="month" *ngFor="let month of months">{{ month }}</div>
        </div>

        <div class="tasks">
          <div class="task-row" *ngFor="let task of tasks">
            <div class="task-info">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-assignee">{{ task.assignee }}</span>
            </div>
            <div class="task-timeline">
              <div
                class="task-bar"
                [style.left.%]="getTaskStart(task)"
                [style.width.%]="getTaskDuration(task)"
                [class]="task.status.toLowerCase()"
                [matTooltip]="getTaskTooltip(task)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .gantt-container {
        padding: 24px;
        height: calc(100vh - 112px);
        display: flex;
        flex-direction: column;
      }

      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
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

      .gantt-chart {
        flex: 1;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .timeline-header {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 16px 0;
        margin-left: 200px;

        .month {
          flex: 1;
          text-align: center;
          font-weight: 500;
          min-width: 100px;
        }
      }

      .tasks {
        flex: 1;
        overflow-y: auto;
        overflow-x: auto;
      }

      .task-row {
        display: flex;
        height: 48px;
        border-bottom: 1px solid #eee;

        .task-info {
          width: 200px;
          flex-shrink: 0;
          padding: 8px 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #f5f5f5;

          .task-title {
            font-weight: 500;
          }

          .task-assignee {
            font-size: 12px;
            color: #666;
          }
        }

        .task-timeline {
          flex: 1;
          position: relative;
          padding: 8px 0;
          min-width: 1200px;

          .task-bar {
            position: absolute;
            height: 32px;
            border-radius: 4px;

            &.todo {
              background: #2196f3;
            }
            &.in_progress {
              background: #ff9800;
            }
            &.done {
              background: #4caf50;
            }
          }
        }
      }
    `,
  ],
  standalone: false,
})
export class TaskGanttComponent implements OnInit {
  projectId: string = "";
  tasks: Task[] = [];
  months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.params["projectId"];
    this.loadTasks();
  }

  loadTasks() {
    this.taskService
      .getTasksByProject(this.projectId)
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
      });
  }

  getTaskStart(task: Task): number {
    const start = new Date(task.dueDate);
    const startOfYear = new Date(start.getFullYear(), 0, 1);
    const daysPassed =
      (start.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    return (daysPassed / 365) * 100;
  }

  getTaskDuration(task: Task): number {
    // Her görev için 2 haftalık süre varsayalım
    return (14 / 365) * 100;
  }

  getTaskTooltip(task: Task): string {
    return `${task.title}\nDurum: ${task.status}\nÖncelik: ${task.priority}\nBitiş: ${task.dueDate}`;
  }
}
