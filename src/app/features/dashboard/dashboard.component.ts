import { Component, OnInit } from "@angular/core";
import { ProjectService } from "../project-management/services/project.service";
import { AvatarService } from "../../core/services/avatar.service";
import { Project } from "../../core/models/project.model";

interface Activity {
  type: "create" | "update" | "delete" | "complete";
  text: string;
  time: Date;
}

interface Task {
  id: string;
  title: string;
  project: string;
  priority: "high" | "medium" | "low";
  dueDate: Date;
  assigneeId: number;
  assigneeName: string;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  activeProjects: Project[] = [];
  recentActivities: Activity[] = [];
  upcomingTasks: Task[] = [];

  constructor(
    private projectService: ProjectService,
    private avatarService: AvatarService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Projeleri yükle
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.activeProjects = projects.filter((p) => p.status === "ACTIVE");
      },
    });

    // Örnek aktiviteler
    this.recentActivities = [
      {
        type: "create",
        text: "Ali Yılmaz yeni bir proje oluşturdu: E-ticaret Platformu",
        time: new Date("2024-01-20T10:30:00"),
      },
      {
        type: "update",
        text: "Ayşe Demir CRM Projesi'nin durumunu güncelledi",
        time: new Date("2024-01-20T09:15:00"),
      },
      {
        type: "complete",
        text: "Web Sitesi Yenileme projesi tamamlandı",
        time: new Date("2024-01-19T16:45:00"),
      },
    ];

    // Örnek görevler
    this.upcomingTasks = [
      {
        id: "1",
        title: "API Entegrasyonu",
        project: "E-ticaret Platformu",
        priority: "high",
        dueDate: new Date("2024-02-01"),
        assigneeId: 1,
        assigneeName: "Ali Yılmaz",
      },
      {
        id: "2",
        title: "Tasarım Revizyonları",
        project: "CRM Projesi",
        priority: "medium",
        dueDate: new Date("2024-02-05"),
        assigneeId: 2,
        assigneeName: "Ayşe Demir",
      },
    ];
  }

  // İstatistik metodları
  getActiveProjectsCount(): number {
    return this.activeProjects.length;
  }

  getActiveProjectsPercentage(): number {
    const totalProjects = this.projectService.projects?.length || 0;
    return (this.activeProjects.length / totalProjects) * 100;
  }

  getPendingTasksCount(): number {
    return this.upcomingTasks.length;
  }

  getPendingTasksPercentage(): number {
    return (this.getPendingTasksCount() / 10) * 100; // Toplam görev sayısına göre
  }

  getTeamMembersCount(): number {
    return new Set(this.activeProjects.flatMap((p) => p.members)).size;
  }

  getRecentMembers() {
    const allMembers = this.activeProjects.flatMap((p) => p.members);
    const uniqueMembers = Array.from(new Set(allMembers));
    return uniqueMembers.slice(0, 5).map((id) => ({
      id,
      name: `Üye ${id}`, // Gerçek isimler için üye servisi kullanılabilir
    }));
  }

  getCompletionRate(): number {
    const completedProjects = this.activeProjects.filter(
      (p) => p.progress === 100
    ).length;
    return (
      Math.round((completedProjects / this.activeProjects.length) * 100) || 0
    );
  }

  // Yardımcı metodlar
  getActivityIcon(type: Activity["type"]): string {
    switch (type) {
      case "create":
        return "add_circle";
      case "update":
        return "edit";
      case "delete":
        return "delete";
      case "complete":
        return "check_circle";
      default:
        return "info";
    }
  }

  getPriorityIcon(priority: Task["priority"]): string {
    switch (priority) {
      case "high":
        return "priority_high";
      case "medium":
        return "drag_handle";
      case "low":
        return "low_priority";
      default:
        return "help";
    }
  }

  getProgressClass(progress: number): string {
    if (progress < 30) return "low";
    if (progress < 70) return "medium";
    return "high";
  }

  getMemberAvatar(memberId: number): string {
    return this.avatarService.getAvatarUrl(memberId);
  }
}
