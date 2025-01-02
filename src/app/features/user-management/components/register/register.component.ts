import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";

@Component({
  selector: "app-register",
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Kayıt Ol</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Kullanıcı Adı</mat-label>
              <input matInput formControlName="username" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>E-posta</mat-label>
              <input matInput formControlName="email" type="email" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Şifre</mat-label>
              <input matInput formControlName="password" type="password" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Rol</mat-label>
              <mat-select formControlName="role">
                <mat-option value="USER">Kullanıcı</mat-option>
                <mat-option value="PROJECT_MANAGER"
                  >Proje Yöneticisi</mat-option
                >
              </mat-select>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="!registerForm.valid"
            >
              Kayıt Ol
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      mat-card {
        width: 100%;
        max-width: 400px;
        padding: 20px;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
  standalone: false,
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      role: ["USER", Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(["/auth/login"]);
        },
        error: (error) => {
          console.error("Registration error:", error);
          // Burada hata mesajını gösterebiliriz
        },
      });
    }
  }
}
