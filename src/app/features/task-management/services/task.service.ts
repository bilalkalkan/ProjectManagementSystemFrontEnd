import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate: Date;
  progress: number;
  assignee?: {
    id: number;
    name: string;
    avatar: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      projectId: 1,
      title: "API Geliştirme",
      description: "REST API endpoint'lerinin oluşturulması",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: new Date("2024-04-01"),
      progress: 60,
      assignee: {
        id: 1,
        name: "Ahmet Yılmaz",
        avatar: "assets/avatars/1.jpg",
      },
    },
    {
      id: 2,
      projectId: 1,
      title: "UI Tasarımı",
      description: "Dashboard sayfasının tasarlanması",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: new Date("2024-04-05"),
      progress: 0,
      assignee: {
        id: 2,
        name: "Ayşe Demir",
        avatar: "assets/avatars/2.jpg",
      },
    },
  ];

  getProjectTasks(projectId: number): Observable<Task[]> {
    const projectTasks = this.tasks.filter(
      (task) => task.projectId === projectId
    );
    console.log("Proje görevleri:", projectTasks);
    return of(projectTasks);
  }

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  getTask(id: number): Observable<Task> {
    const task = this.tasks.find((t) => t.id === id);
    return of(task!);
  }

  updateTask(id: number, updates: Partial<Task>): Observable<Task> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updates };
      return of(this.tasks[index]);
    }
    throw new Error("Task not found");
  }

  deleteTask(id: number): Observable<void> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
    return of(void 0);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    const newTask: Task = {
      id: this.tasks.length + 1,
      projectId: task.projectId || 0,
      title: task.title || "",
      description: task.description || "",
      status: task.status || "TODO",
      priority: task.priority || "MEDIUM",
      dueDate: task.dueDate || new Date(),
      progress: task.progress || 0,
      assignee: task.assignee,
    };

    this.tasks.push(newTask);
    console.log("Yeni görev eklendi:", newTask);
    return of(newTask);
  }

  updateTaskStatus(
    taskId: number,
    status: "TODO" | "IN_PROGRESS" | "DONE"
  ): Observable<Task> {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      return of(task);
    }
    throw new Error("Task not found");
  }

  // ... diğer metodlar aynı
}
