import { Component, OnInit } from "@angular/core";
import { ProjectService } from "../../services/project.service";
import { Project, ProjectStatus } from "../../../../core/models/project.model";
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
  // ProjectStatus enum'unu template'te kullanabilmek için
  ProjectStatus = ProjectStatus;
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
        (project.title || project.name || "")
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        (project.description || "")
          .toLowerCase()
          .includes(this.searchText.toLowerCase());

      // Status filtreleme
      let matchesStatus = this.selectedStatus === "all";

      if (!matchesStatus) {
        const status = project.status;

        if (typeof status === "number") {
          // Enum değeri sayı olarak gelirse
          matchesStatus =
            (this.selectedStatus === "ACTIVE" && status === 1) ||
            (this.selectedStatus === "ON_HOLD" && status === 3) ||
            (this.selectedStatus === "COMPLETED" && status === 2) ||
            (this.selectedStatus === "PLANNED" && status === 0);
        } else if (typeof status === "string") {
          // String olarak gelirse
          matchesStatus = this.selectedStatus === status;
        } else {
          // ProjectStatus enum değeri olarak gelirse
          matchesStatus =
            (this.selectedStatus === "ACTIVE" &&
              status === ProjectStatus.InProgress) ||
            (this.selectedStatus === "ON_HOLD" &&
              status === ProjectStatus.OnHold) ||
            (this.selectedStatus === "COMPLETED" &&
              status === ProjectStatus.Completed) ||
            (this.selectedStatus === "PLANNED" &&
              status === ProjectStatus.NotStarted);
        }
      }

      return matchesSearch && matchesStatus;
    });
  }

  getStatusText(status: ProjectStatus | string | number): string {
    if (typeof status === "string") {
      switch (status) {
        case "ACTIVE":
          return "Aktif";
        case "ON_HOLD":
          return "Beklemede";
        case "COMPLETED":
          return "Tamamlandı";
        case "PLANNED":
          return "Planlandı";
        default:
          return status;
      }
    } else if (typeof status === "number") {
      // Enum değeri sayı olarak gelirse
      switch (status) {
        case 1: // InProgress
          return "Aktif";
        case 3: // OnHold
          return "Beklemede";
        case 2: // Completed
          return "Tamamlandı";
        case 0: // NotStarted
          return "Planlandı";
        case 4: // Cancelled
          return "İptal Edildi";
        default:
          return "Bilinmiyor";
      }
    } else {
      // ProjectStatus enum değeri
      switch (status) {
        case ProjectStatus.InProgress:
          return "Aktif";
        case ProjectStatus.OnHold:
          return "Beklemede";
        case ProjectStatus.Completed:
          return "Tamamlandı";
        case ProjectStatus.NotStarted:
          return "Planlandı";
        case ProjectStatus.Cancelled:
          return "İptal Edildi";
        default:
          return "Bilinmiyor";
      }
    }
  }

  getStatusClass(status: ProjectStatus | string | number): any {
    let statusClass = "";

    if (typeof status === "string") {
      switch (status) {
        case "ACTIVE":
          statusClass = "active";
          break;
        case "ON_HOLD":
          statusClass = "on_hold";
          break;
        case "COMPLETED":
          statusClass = "completed";
          break;
        case "PLANNED":
          statusClass = "planned";
          break;
        default:
          statusClass = "";
      }
    } else if (typeof status === "number") {
      // Enum değeri sayı olarak gelirse
      switch (status) {
        case 1: // InProgress
          statusClass = "active";
          break;
        case 3: // OnHold
          statusClass = "on_hold";
          break;
        case 2: // Completed
          statusClass = "completed";
          break;
        case 0: // NotStarted
          statusClass = "planned";
          break;
        case 4: // Cancelled
          statusClass = "cancelled";
          break;
        default:
          statusClass = "";
      }
    } else {
      // ProjectStatus enum değeri
      switch (status) {
        case ProjectStatus.InProgress:
          statusClass = "active";
          break;
        case ProjectStatus.OnHold:
          statusClass = "on_hold";
          break;
        case ProjectStatus.Completed:
          statusClass = "completed";
          break;
        case ProjectStatus.NotStarted:
          statusClass = "planned";
          break;
        case ProjectStatus.Cancelled:
          statusClass = "cancelled";
          break;
        default:
          statusClass = "";
      }
    }

    return { [statusClass]: true };
  }

  getProgressClass(progress: number | undefined): string {
    const progressValue = progress || 0;
    if (progressValue < 30) return "progress-low";
    if (progressValue < 70) return "progress-medium";
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

  getDaysLeft(dueDate: Date | string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getProjectTitle(project: Project): string {
    return project.title || project.name || "İsimsiz Proje";
  }

  getMemberAvatar(memberId: number): string {
    return this.avatarService.getAvatarUrl(memberId);
  }
}
