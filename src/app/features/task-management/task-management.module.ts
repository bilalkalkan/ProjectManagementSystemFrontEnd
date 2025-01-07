import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskBoardComponent } from "./components/task-board/task-board.component";
import { TaskGanttComponent } from "./components/task-gantt/task-gantt.component";
import { SharedModule } from "../../shared/shared.module";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProjectService } from "../../features/project-management/services/project.service";

const routes: Routes = [{ path: "", component: TaskListComponent }];

@NgModule({
  declarations: [TaskListComponent, TaskBoardComponent, TaskGanttComponent],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    RouterModule.forChild(routes),
  ],
  providers: [ProjectService],
})
export class TaskManagementModule {}
