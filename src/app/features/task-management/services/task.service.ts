import { Injectable } from "@angular/core";
import { Observable, of, map } from "rxjs";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate: Date;
  progress: number;
}

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private dummyTasks: Task[] = [
    {
      id: "1",
      title: "Frontend Tasarımı",
      description: "Ana sayfa tasarımının güncellenmesi",
      status: "IN_PROGRESS",
      priority: "HIGH",
      assignee: {
        id: "Ali Yılmaz",
        name: "Ali Yılmaz",
        avatar: "https://example.com/ali-yilmaz.jpg",
      },
      dueDate: new Date("2024-03-25"),
      progress: 50,
    },
    {
      id: "2",
      title: "API Entegrasyonu",
      description: "Backend servisleri ile bağlantı kurulması",
      status: "TODO",
      priority: "MEDIUM",
      assignee: {
        id: "Ayşe Demir",
        name: "Ayşe Demir",
        avatar: "https://example.com/ayse-demir.jpg",
      },
      dueDate: new Date("2024-03-28"),
      progress: 0,
    },
    {
      id: "3",
      title: "Test Yazılması",
      description: "Unit testlerin tamamlanması",
      status: "DONE",
      priority: "LOW",
      assignee: {
        id: "Mehmet Kaya",
        name: "Mehmet Kaya",
        avatar: "https://example.com/mehmet-kaya.jpg",
      },
      dueDate: new Date("2024-03-20"),
      progress: 100,
    },
  ];

  getTasks(): Observable<Task[]> {
    return of(this.dummyTasks);
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return of(this.dummyTasks.find((task) => task.id === id));
  }

  addTask(task: Omit<Task, "id">): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: (this.dummyTasks.length + 1).toString(),
    };
    this.dummyTasks.push(newTask);
    return of(newTask);
  }

  updateTask(task: Task): Observable<Task> {
    const index = this.dummyTasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      this.dummyTasks[index] = task;
    }
    return of(task);
  }

  deleteTask(id: string): Observable<void> {
    const index = this.dummyTasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.dummyTasks.splice(index, 1);
    }
    return of(void 0);
  }

  getProjectTasks(projectId: string): Observable<Task[]> {
    return this.getTasks().pipe(
      map((tasks) => tasks.filter((task) => task.assignee.id === projectId))
    );
  }
}
