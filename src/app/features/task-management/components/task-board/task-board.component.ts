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

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.params["projectId"];
    this.loadProjectDetails();
    this.loadTasks();
  }

  loadProjectDetails() {
    this.projectService.getProject(this.projectId).subscribe({
      next: (project: Project) => {
        if (project) {
          this.projectTitle = project.title;
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
      this.todoTasks = tasks.filter((task) => task.status === "TODO");
      this.inProgressTasks = tasks.filter(
        (task) => task.status === "IN_PROGRESS"
      );
      this.doneTasks = tasks.filter((task) => task.status === "DONE");
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
        this.loadTasks();
      });
  }
}
