import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./features/user-management/user-management.module").then(
        (m) => m.UserManagementModule
      ),
  },
  {
    path: "tasks",
    loadChildren: () =>
      import("./features/task-management/task-management.module").then(
        (m) => m.TaskManagementModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "projects",
    loadChildren: () =>
      import("./features/project-management/project-management.module").then(
        (m) => m.ProjectManagementModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./features/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "",
    redirectTo: "tasks",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
