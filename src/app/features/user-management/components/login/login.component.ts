import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";

@Component({
  selector: "app-login",
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Giriş Yap</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>E-posta</mat-label>
              <input matInput formControlName="email" type="email" />
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                E-posta zorunludur
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Şifre</mat-label>
              <input matInput formControlName="password" type="password" />
              <mat-error
                *ngIf="loginForm.get('password')?.hasError('required')"
              >
                Şifre zorunludur
              </mat-error>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="!loginForm.valid"
            >
              Giriş Yap
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
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
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(["/projects"]);
        },
        error: (error) => {
          console.error("Login error:", error);
          // Burada hata mesajını gösterebiliriz
        },
      });
    }
  }
}
