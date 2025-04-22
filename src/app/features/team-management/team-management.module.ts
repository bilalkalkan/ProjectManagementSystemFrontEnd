import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TeamListComponent } from "./components/team-list/team-list.component";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatChipsModule } from "@angular/material/chips";
import { SharedModule } from "../../shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TeamMemberFormComponent } from "./components/team-member-form/team-member-form.component";
import { RoleManagementComponent } from "./components/role-management/role-management.component";
import { TeamManagementRoutingModule } from "./team-management-routing.module";

@NgModule({
  declarations: [
    TeamListComponent,
    TeamMemberFormComponent,
    RoleManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    TeamManagementRoutingModule,
  ],
})
export class TeamManagementModule {
  constructor() {
    console.log("TeamManagementModule yüklendi");
  }
}
