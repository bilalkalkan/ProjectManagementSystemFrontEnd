import { Component, OnInit } from "@angular/core";
import { TaskService, Task } from "../../services/task.service";
import { ProjectService } from "../../../project-management/services/project.service";
import { Project } from "../../../../core/models/project.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.scss"],
  standalone: false,
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  projects: Project[] = [];
  projectId?: string;
  pageTitle = "Tüm Görevler";
  pageDescription = "Projelerdeki görevlerin listesi";
  displayedColumns = [
    "title",
    "project",
    "assignee",
    "priority",
    "status",
    "dueDate",
    "actions",
  ];

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.params["projectId"];
    if (this.projectId) {
      this.loadProjectDetails();
    } else {
      this.loadProjects();
    }
  }

  loadProjectDetails() {
    this.projectService.getProject(this.projectId!).subscribe({
      next: (project: Project) => {
        this.pageTitle = project.title;
        this.pageDescription = "Proje Görevleri";
        this.displayedColumns = this.displayedColumns.filter(
          (col) => col !== "project"
        );
        this.loadProjectTasks();
      },
      error: (error) => {
        console.error("Error loading project:", error);
      },
    });
  }

  loadProjectTasks() {
    this.taskService.getTasksByProject(this.projectId!).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  loadProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.loadAllTasks();
    });
  }

  loadAllTasks() {
    this.tasks = [];
    this.projects.forEach((project) => {
      this.taskService.getTasksByProject(project.id).subscribe((tasks) => {
        this.tasks = [...this.tasks, ...tasks];
      });
    });
  }

  updateTaskStatus(task: Task, status: Task["status"]) {
    this.taskService
      .updateTask(task.projectId, task.id, { status })
      .subscribe(() => {
        this.loadAllTasks();
      });
  }

  getProjectTitle(projectId: string): string {
    const project = this.projects.find((p) => p.id === projectId);
    return project ? project.title : "";
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

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.style.display = "none";
    }
  }

  getAvatarFallback(name: string): string {
    return name ? name.charAt(0) : "?";
  }

  isOverdue(date: Date): boolean {
    return new Date(date) < new Date();
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

  getStatusIcon(status: string): string {
    switch (status) {
      case "TODO":
        return "radio_button_unchecked";
      case "IN_PROGRESS":
        return "pending";
      case "DONE":
        return "check_circle";
      default:
        return "";
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
}
