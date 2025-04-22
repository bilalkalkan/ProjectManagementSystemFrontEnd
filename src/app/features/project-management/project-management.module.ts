import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { ProjectListComponent } from "./components/project-list/project-list.component";
import { ProjectDetailComponent } from "./components/project-detail/project-detail.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ProjectFormComponent } from "./components/project-form/project-form.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";

@NgModule({
  declarations: [ProjectListComponent, ProjectFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: ProjectListComponent },
      { path: "new", component: ProjectFormComponent },
      {
        path: ":id",
        loadComponent: () =>
          import("./components/project-detail/project-detail.component").then(
            (m) => m.ProjectDetailComponent
          ),
        data: { animation: "ProjectDetail" },
      },
      {
        path: ":id/edit",
        component: ProjectFormComponent,
        data: { isEdit: true },
      },
      {
        path: ":id/board",
        loadChildren: () =>
          import("../task-management/task-management.module").then(
            (m) => m.TaskManagementModule
          ),
      },
      {
        path: ":id/members",
        loadComponent: () =>
          import("./components/project-members/project-members.component").then(
            (m) => m.ProjectMembersComponent
          ),
      },
      // ... diğer rotalar
    ]),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatDialogModule,
    MatListModule,
  ],
})
export class ProjectManagementModule {}
