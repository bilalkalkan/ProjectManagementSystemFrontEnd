import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { Project } from "../../../core/models/project.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private apiUrl = "api"; // veya environment.apiUrl
  public projects: Project[] = [
    {
      id: "1",
      title: "E-ticaret Platformu",
      description: "Online alışveriş platformunun geliştirilmesi",
      status: "ACTIVE",
      dueDate: new Date("2024-06-30"),
      progress: 35,
      members: [1, 2],
      completedTasks: 5,
      totalTasks: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Mobil Uygulama",
      description: "iOS ve Android için mobil uygulama geliştirme",
      status: "ACTIVE",
      dueDate: new Date("2024-07-15"),
      progress: 20,
      members: [1, 3],
      completedTasks: 3,
      totalTasks: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "CRM Sistemi",
      description: "Müşteri ilişkileri yönetim sistemi",
      status: "PLANNED",
      dueDate: new Date("2024-08-30"),
      progress: 0,
      members: [2, 3],
      completedTasks: 0,
      totalTasks: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  getProject(id: string): Observable<Project> {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      return throwError(() => new Error("Project not found"));
    }
    return of(project);
  }

  updateProjectStatus(id: string, status: string): Observable<void> {
    const project = this.projects.find((p) => p.id === id);
    if (project) {
      project.status = status as any;
    }
    return of(void 0);
  }

  updateProject(id: string, updates: Partial<Project>): Observable<Project> {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      return of(this.projects[index]);
    }
    throw new Error("Project not found");
  }

  createProject(project: Partial<Project>): Observable<Project> {
    const newProject: Project = {
      id: (this.projects.length + 1).toString(),
      title: project.title || "",
      description: project.description || "",
      status: "ACTIVE",
      dueDate: project.dueDate || new Date(),
      progress: 0,
      members: [],
      completedTasks: 0,
      totalTasks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.push(newProject);
    return of(newProject);
  }

  addMember(projectId: string, memberId: number): Observable<void> {
    const project = this.projects.find((p) => p.id === projectId);
    if (project && !project.members.includes(memberId)) {
      project.members.push(memberId);
    }
    return of(void 0);
  }

  removeMember(projectId: string, memberId: number): Observable<void> {
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      project.members = project.members.filter((id) => id !== memberId);
    }
    return of(void 0);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
  }
}
