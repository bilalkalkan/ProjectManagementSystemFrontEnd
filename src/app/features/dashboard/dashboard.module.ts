import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";

// Material Modülleri
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";

@NgModule({
  imports: [
    CommonModule,
    DashboardComponent,
    RouterModule.forChild([{ path: "", component: DashboardComponent }]),
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatListModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
  ],
})
export class DashboardModule {}
