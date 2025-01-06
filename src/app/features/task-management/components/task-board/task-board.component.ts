import { Component, OnInit } from "@angular/core";
import { TaskService, Task } from "../../services/task.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-task-board",
  templateUrl: "./task-board.component.html",
  styleUrls: ["./task-board.component.scss"],
  standalone: false,
})
export class TaskBoardComponent implements OnInit {
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
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
      this.taskService.updateTask(updatedTask).subscribe(() => {
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
}
