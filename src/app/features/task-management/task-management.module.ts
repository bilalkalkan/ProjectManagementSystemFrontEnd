import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskFormComponent } from "./components/task-form/task-form.component";
import { TaskDetailComponent } from "./components/task-detail/task-detail.component";
import { TaskBoardComponent } from "./components/task-board/task-board.component";

const routes: Routes = [
  { path: "", component: TaskBoardComponent },
  { path: "new", component: TaskFormComponent },
  { path: ":taskId", component: TaskDetailComponent },
  { path: ":taskId/edit", component: TaskFormComponent },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    TaskListComponent,
    TaskFormComponent,
    TaskDetailComponent,
    TaskBoardComponent,
  ],
})
export class TaskManagementModule {}
