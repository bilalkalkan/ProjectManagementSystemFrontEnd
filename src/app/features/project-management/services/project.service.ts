import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Project } from "../../../core/models/project.model";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private projects: Project[] = [
    {
      id: 1,
      title: "E-ticaret Platformu",
      description: "Online alışveriş platformunun geliştirilmesi",
      status: "ACTIVE",
      dueDate: new Date("2024-06-30"),
      progress: 35,
      members: [1, 2], // Ahmet ve Ayşe
    },
  ];

  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  getProject(id: number): Observable<Project> {
    return of(this.projects.find((p) => p.id === id)!);
  }

  updateProjectStatus(id: number, status: string): Observable<void> {
    const project = this.projects.find((p) => p.id === id);
    if (project) {
      project.status = status as any;
    }
    return of(void 0);
  }

  updateProject(id: number, updates: Partial<Project>): Observable<Project> {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      return of(this.projects[index]);
    }
    throw new Error("Project not found");
  }

  createProject(project: Partial<Project>): Observable<Project> {
    const newProject: Project = {
      id: this.projects.length + 1,
      title: project.title || "",
      description: project.description || "",
      status: "ACTIVE",
      dueDate: project.dueDate || new Date(),
      progress: 0,
      members: [],
    };
    this.projects.push(newProject);
    return of(newProject);
  }

  addMember(projectId: number, memberId: number): Observable<void> {
    const project = this.projects.find((p) => p.id === projectId);
    if (project && !project.members.includes(memberId)) {
      project.members.push(memberId);
    }
    return of(void 0);
  }

  removeMember(projectId: number, memberId: number): Observable<void> {
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      project.members = project.members.filter((id) => id !== memberId);
    }
    return of(void 0);
  }
}
