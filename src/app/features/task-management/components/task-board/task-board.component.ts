import { Component, OnInit } from "@angular/core";
import { TaskService, Task } from "../../services/task.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../../../features/project-management/services/project.service";
import { Project } from "../../../../core/models/project.model";

@Component({
  selector: "app-task-board",
  templateUrl: "./task-board.component.html",
  styleUrls: ["./task-board.component.scss"],
  standalone: false,
})
export class TaskBoardComponent implements OnInit {
  projectId: string = "";
  projectTitle: string = "";
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  // Filtreleme ve sıralama için değişkenler
  statusFilter: string = "all";
  priorityFilter: string = "all";

  // Orijinal görev listeleri (filtreleme için)
  allTodoTasks: Task[] = [];
  allInProgressTasks: Task[] = [];
  allDoneTasks: Task[] = [];

  // Filtreleme metodları
  applyFilters() {
    // Durum filtresine göre görevleri filtrele
    if (this.statusFilter === "all") {
      // Tüm durumlar için öncelik filtresini uygula
      this.todoTasks = this.filterByPriority(this.allTodoTasks);
      this.inProgressTasks = this.filterByPriority(this.allInProgressTasks);
      this.doneTasks = this.filterByPriority(this.allDoneTasks);
    } else {
      // Sadece seçili durumu göster ve öncelik filtresini uygula
      this.todoTasks =
        this.statusFilter === "TODO"
          ? this.filterByPriority(this.allTodoTasks)
          : [];
      this.inProgressTasks =
        this.statusFilter === "IN_PROGRESS"
          ? this.filterByPriority(this.allInProgressTasks)
          : [];
      this.doneTasks =
        this.statusFilter === "DONE"
          ? this.filterByPriority(this.allDoneTasks)
          : [];
    }
  }

  filterByPriority(tasks: Task[]): Task[] {
    if (this.priorityFilter === "all") {
      return tasks;
    }
    return tasks.filter((task) => task.priority === this.priorityFilter);
  }

  resetFilters() {
    this.statusFilter = "all";
    this.priorityFilter = "all";
    this.applyFilters();
  }

  openTaskDetails(task: Task) {
    console.log("Görev detayları:", task);
    // TODO: Görev detaylarını gösteren bir dialog aç
    // Şimdilik sadece konsola yazdırıyoruz
    alert(
      `Görev: ${task.title}\nDurum: ${task.status}\nÖncelik: ${task.priority}\nAçıklama: ${task.description}`
    );
  }

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.params["projectId"];

    if (this.projectId) {
      // Belirli bir projenin görevlerini yükle
      this.loadProjectDetails();
      this.loadTasks();
    } else {
      // Tüm görevleri yükle
      this.projectTitle = "Tüm Görevler";
      this.loadAllTasks();
    }
  }

  loadProjectDetails() {
    this.projectService.getProject(this.projectId).subscribe({
      next: (project: Project) => {
        if (project) {
          this.projectTitle = project.title || project.name || "Proje";
        } else {
          console.error("Project not found");
          // Opsiyonel: Kullanıcıyı projeler sayfasına yönlendir
          // this.router.navigate(['/projects']);
        }
      },
      error: (error) => {
        console.error("Error loading project:", error);
      },
    });
  }

  loadTasks() {
    this.taskService.getTasksByProject(this.projectId).subscribe((tasks) => {
      // Orijinal görev listelerini sakla
      this.allTodoTasks = tasks.filter((task) => task.status === "TODO");
      this.allInProgressTasks = tasks.filter(
        (task) => task.status === "IN_PROGRESS"
      );
      this.allDoneTasks = tasks.filter((task) => task.status === "DONE");

      // Filtreleri uygula
      this.applyFilters();
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      let newStatus: "TODO" | "IN_PROGRESS" | "DONE";

      if (event.container.id === "todoList") {
        newStatus = "TODO";
      } else if (event.container.id === "inProgressList") {
        newStatus = "IN_PROGRESS";
      } else {
        newStatus = "DONE";
      }

      const updatedTask: Task = { ...task, status: newStatus };
      this.taskService
        .updateTask(this.projectId, task.id, { status: newStatus })
        .subscribe(() => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        });
    }
  }

  addNewTask() {
    // TODO: Implement add task dialog
  }

  updateTaskStatus(task: Task, newStatus: Task["status"]) {
    this.taskService
      .updateTaskStatus(task.projectId, task.id, newStatus)
      .subscribe(() => {
        // Güncelleme başarılı
        if (this.projectId) {
          this.loadTasks();
        } else {
          this.loadAllTasks();
        }
      });
  }

  loadAllTasks() {
    // Önce tüm projeleri yükle
    this.projectService.getProjects().subscribe((projects) => {
      // Tüm görevleri sıfırla
      this.allTodoTasks = [];
      this.allInProgressTasks = [];
      this.allDoneTasks = [];

      // Her proje için görevleri yükle
      projects.forEach((project) => {
        this.taskService.getTasksByProject(project.id).subscribe((tasks) => {
          // Görevleri durumlarına göre ayır
          this.allTodoTasks = [
            ...this.allTodoTasks,
            ...tasks.filter((task) => task.status === "TODO"),
          ];
          this.allInProgressTasks = [
            ...this.allInProgressTasks,
            ...tasks.filter((task) => task.status === "IN_PROGRESS"),
          ];
          this.allDoneTasks = [
            ...this.allDoneTasks,
            ...tasks.filter((task) => task.status === "DONE"),
          ];

          // Filtreleri uygula
          this.applyFilters();
        });
      });
    });
  }
}
