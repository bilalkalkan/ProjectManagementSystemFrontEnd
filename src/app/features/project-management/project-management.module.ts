import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";

// Material Modülleri
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";

// Komponentler
import { ProjectListComponent } from "./components/project-list/project-list.component";
import { ProjectDetailComponent } from "./components/project-detail/project-detail.component";
import { AddMemberDialogComponent } from "./components/add-member-dialog/add-member-dialog.component";
import { ProjectFormComponent } from "./components/project-form/project-form.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: ProjectListComponent },
      { path: "new", component: ProjectFormComponent },
      {
        path: ":id",
        children: [
          { path: "", component: ProjectDetailComponent },
          { path: "edit", component: ProjectFormComponent },
          {
            path: "board",
            loadChildren: () =>
              import("../task-management/task-management.module").then(
                (m) => m.TaskManagementModule
              ),
          },
          {
            path: "tasks",
            loadChildren: () =>
              import("../task-management/task-management.module").then(
                (m) => m.TaskManagementModule
              ),
          },
        ],
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    ProjectListComponent,
    ProjectDetailComponent,
    AddMemberDialogComponent,
    ProjectFormComponent,
  ],
  providers: [DatePipe],
})
export class ProjectManagementModule {}
