import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    // Local storage'dan tema tercihini al
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      this.setDarkMode(savedTheme === "true");
    } else {
      // Varsayılan olarak açık tema kullan
      this.setDarkMode(false);
      localStorage.setItem("darkMode", "false");
    }

    // Başlangıçta açık temayı zorla
    document.documentElement.classList.remove("dark-theme");
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.next(isDark);
    localStorage.setItem("darkMode", isDark.toString());

    if (isDark) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode.value);
  }
}
