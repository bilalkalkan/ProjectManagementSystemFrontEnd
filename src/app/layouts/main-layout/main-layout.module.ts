import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { MatToolbarModule } from "@angular/material/toolbar";
import { HeaderComponent } from "./header/header.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatBadgeModule,
    MatToolbarModule,
  ],
  exports: [HeaderComponent],
})
export class MainLayoutModule {}
