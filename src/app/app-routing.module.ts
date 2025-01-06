import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { AuthGuard } from "./core/guards/auth.guard";

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
        path: "tasks",
        loadChildren: () =>
          import("./features/task-management/task-management.module").then(
            (m) => m.TaskManagementModule
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
