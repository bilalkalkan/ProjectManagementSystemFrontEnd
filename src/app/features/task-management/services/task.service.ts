import { Injectable } from "@angular/core";
import { Observable, of, map } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignee: {
    id: number;
    name: string;
    avatar: string;
  };
  dueDate: Date;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = "api";

  // Örnek task verileri
  private dummyTasks: Task[] = [
    {
      id: "1",
      projectId: "1",
      title: "API Entegrasyonu",
      description: "Backend servisleri ile bağlantıların kurulması",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: new Date("2024-03-25"),
      assignee: {
        id: 1,
        name: "Ali Yılmaz",
        avatar: "api/users/1/avatar",
      },
      progress: 60,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      id: "2",
      projectId: "1",
      title: "Tasarım Revizyonları",
      description: "Kullanıcı arayüzü iyileştirmeleri",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: new Date("2024-03-28"),
      assignee: {
        id: 2,
        name: "Ayşe Demir",
        avatar: "api/users/2/avatar",
      },
      progress: 0,
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "3",
      projectId: "1",
      title: "Test Yazılması",
      description: "Unit testlerin tamamlanması",
      status: "DONE",
      priority: "LOW",
      dueDate: new Date("2024-03-20"),
      assignee: {
        id: 1,
        name: "Ali Yılmaz",
        avatar: "/assets/images/avatars/avatar-1.jpg",
      },
      progress: 100,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-18"),
    },
    {
      id: "4",
      projectId: "1",
      title: "Performans Optimizasyonu",
      description: "Sayfa yüklenme hızının artırılması",
      status: "TODO",
      priority: "HIGH",
      dueDate: new Date("2024-04-01"),
      assignee: {
        id: 2,
        name: "Ayşe Demir",
        avatar: "/assets/images/avatars/avatar-2.jpg",
      },
      progress: 0,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      id: "5",
      projectId: "1",
      title: "Güvenlik Denetimi",
      description: "Güvenlik açıklarının taranması ve giderilmesi",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: new Date("2024-03-30"),
      assignee: {
        id: 1,
        name: "Ali Yılmaz",
        avatar: "/assets/images/avatars/avatar-1.jpg",
      },
      progress: 30,
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-19"),
    },
    {
      id: "6",
      projectId: "2",
      title: "UI/UX Tasarımı",
      description: "Mobil uygulama arayüz tasarımı",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: new Date("2024-04-15"),
      assignee: {
        id: 1,
        name: "Ali Yılmaz",
        avatar: "/assets/images/avatars/avatar-1.jpg",
      },
      progress: 40,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "7",
      projectId: "2",
      title: "Push Notifications",
      description: "Bildirim sisteminin implementasyonu",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: new Date("2024-04-20"),
      assignee: {
        id: 3,
        name: "Mehmet Kaya",
        avatar: "assets/avatars/3.jpg",
      },
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "8",
      projectId: "3",
      title: "Veritabanı Tasarımı",
      description: "CRM veritabanı şemasının oluşturulması",
      status: "TODO",
      priority: "HIGH",
      dueDate: new Date("2024-05-01"),
      assignee: {
        id: 2,
        name: "Ayşe Demir",
        avatar: "/assets/images/avatars/avatar-2.jpg",
      },
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor(private http: HttpClient) {}

  getTasksByProject(projectId: string): Observable<Task[]> {
    // Projeye ait taskları filtrele
    return of(this.dummyTasks.filter((task) => task.projectId === projectId));
  }

  // Görev oluştur
  createTask(projectId: string, task: Partial<Task>): Observable<Task> {
    return of({} as Task); // Backend için: return this.http.post<Task>(`${this.apiUrl}/projects/${projectId}/tasks`, task);
  }

  // Görev güncelle
  updateTask(
    projectId: string,
    taskId: string,
    updates: Partial<Task>
  ): Observable<Task> {
    return of({} as Task);
  }

  // Görev sil
  deleteTask(projectId: string, taskId: string): Observable<void> {
    return of(void 0);
  }

  // Görev durumunu güncelle
  updateTaskStatus(
    projectId: string,
    taskId: string,
    status: Task["status"]
  ): Observable<void> {
    return of(void 0);
  }

  // Görev atama
  assignTask(
    projectId: string,
    taskId: string,
    assigneeId: number
  ): Observable<void> {
    return of(void 0);
  }
}
