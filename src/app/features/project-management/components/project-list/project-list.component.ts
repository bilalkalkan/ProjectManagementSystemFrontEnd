import { Component, OnInit } from "@angular/core";
import { ProjectService } from "../../services/project.service";
import { Project } from "../../../../core/models/project.model";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AvatarService } from "../../../../core/services/avatar.service";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
  standalone: false,
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  searchText = "";
  selectedStatus = "all";

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private avatarService: AvatarService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error("Projeler yüklenirken hata oluştu:", error);
        this.snackBar.open("Projeler yüklenirken hata oluştu", "Tamam", {
          duration: 3000,
        });
      },
    });
  }

  get filteredProjects(): Project[] {
    return this.projects.filter((project) => {
      const matchesSearch =
        !this.searchText ||
        project.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        project.description
          .toLowerCase()
          .includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.selectedStatus === "all" || project.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "Aktif";
      case "ON_HOLD":
        return "Beklemede";
      case "COMPLETED":
        return "Tamamlandı";
      default:
        return status;
    }
  }

  getProgressClass(progress: number): string {
    if (progress < 30) return "progress-low";
    if (progress < 70) return "progress-medium";
    return "progress-high";
  }

  deleteProject(project: Project) {
    if (confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          // Projeyi listeden kaldır
          this.projects = this.projects.filter((p) => p.id !== project.id);

          this.snackBar.open("Proje başarıyla silindi", "Tamam", {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error("Proje silinirken hata oluştu:", error);
          this.snackBar.open("Proje silinirken hata oluştu", "Tamam", {
            duration: 3000,
          });
        },
      });
    }
  }

  getDaysLeft(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getMemberAvatar(memberId: number): string {
    return this.avatarService.getAvatarUrl(memberId);
  }
}
