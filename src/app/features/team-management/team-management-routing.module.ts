import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TeamListComponent } from "./components/team-list/team-list.component";
import { RoleManagementComponent } from "./components/role-management/role-management.component";

const routes: Routes = [
  {
    path: "",
    component: TeamListComponent,
  },
  {
    path: "roles",
    component: RoleManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamManagementRoutingModule {
  constructor() {
    console.log("TeamManagementRoutingModule yüklendi");
    console.log("Routes:", routes);
  }
}
