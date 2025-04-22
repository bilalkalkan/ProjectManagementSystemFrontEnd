import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { TaskBoardComponent } from "./features/task-management/components/task-board/task-board.component";
import { TaskListComponent } from "./features/task-management/components/task-list/task-list.component";
import { TaskGanttComponent } from "./features/task-management/components/task-gantt/task-gantt.component";

const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./features/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "projects",
        loadChildren: () =>
          import(
            "./features/project-management/project-management.module"
          ).then((m) => m.ProjectManagementModule),
      },
      {
        path: "projects/:projectId",
        children: [
          { path: "", redirectTo: "board", pathMatch: "full" },
          {
            path: "board",
            component: TaskBoardComponent,
          },
          {
            path: "tasks",
            component: TaskListComponent,
          },
          {
            path: "gantt",
            component: TaskGanttComponent,
          },
        ],
      },
      {
        path: "tasks",
        loadChildren: () =>
          import("./features/task-management/task-management.module").then(
            (m) => m.TaskManagementModule
          ),
      },
      {
        path: "team",
        loadChildren: () =>
          import("./features/team-management/team-management.module").then(
            (m) => m.TeamManagementModule
          ),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./features/user-management/user-management.module").then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./features/user-management/user-management.module").then(
        (m) => m.UserManagementModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
