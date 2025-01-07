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
      // Sistem temasını kontrol et
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      this.setDarkMode(prefersDark);
    }
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.next(isDark);
    localStorage.setItem("darkMode", isDark.toString());
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode.value);
  }
}
