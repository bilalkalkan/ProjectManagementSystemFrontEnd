import { Component, OnInit } from "@angular/core";
import { ThemeService } from "./core/services/theme.service";

@Component({
  selector: "app-root",
  template: `<router-outlet></router-outlet>`,
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Uygulama başladığında açık temayı zorla
    this.themeService.setDarkMode(false);
    localStorage.removeItem("darkMode");
    localStorage.setItem("darkMode", "false");

    // Dark theme class'ını kaldır
    document.documentElement.classList.remove("dark-theme");
    document.body.classList.remove("dark-theme");
  }
}
