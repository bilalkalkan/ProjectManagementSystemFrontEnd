import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
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
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { ProjectService } from "../../features/project-management/services/project.service";

const routes: Routes = [
  { path: "", component: TaskListComponent },
  { path: "board", component: TaskBoardComponent },
  { path: "gantt", component: TaskGanttComponent },
];

@NgModule({
  declarations: [TaskListComponent, TaskBoardComponent, TaskGanttComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DragDropModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatDialogModule,
    RouterModule.forChild(routes),
  ],
  providers: [ProjectService],
})
export class TaskManagementModule {}
