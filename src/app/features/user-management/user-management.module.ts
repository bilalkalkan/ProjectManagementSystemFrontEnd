import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { AuthGuard } from "../../core/guards/auth.guard";

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class UserManagementModule {}
