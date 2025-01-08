import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { HeaderComponent } from "./header/header.component";
import { SharedModule } from "../../shared/shared.module";
import { MainLayoutComponent } from "./main-layout.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [MainLayoutComponent, HeaderComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatBadgeModule,
    MatToolbarModule,
    MatSidenavModule,
  ],
  exports: [HeaderComponent],
})
export class MainLayoutModule {}
