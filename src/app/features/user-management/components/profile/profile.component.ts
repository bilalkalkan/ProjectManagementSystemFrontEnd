import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth.service";

@Component({
  selector: "app-profile",
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Profil Bilgileri</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="avatar-section">
            <img
              [src]="currentUser?.avatarUrl || 'assets/default-avatar.png'"
              alt="avatar"
            />
            <button
              mat-raised-button
              color="primary"
              (click)="fileInput.click()"
            >
              Avatar Değiştir
            </button>
            <input
              #fileInput
              type="file"
              hidden
              accept="image/*"
              (change)="onFileSelected($event)"
            />
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Kullanıcı Adı</mat-label>
              <input matInput formControlName="username" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>E-posta</mat-label>
              <input matInput formControlName="email" type="email" />
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="!profileForm.valid"
            >
              Güncelle
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .profile-container {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }
      .avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
      }
      .avatar-section img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
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
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.profileForm.patchValue({
        username: this.currentUser.username,
        email: this.currentUser.email,
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Avatar yükleme işlemi burada yapılacak
      console.log("Avatar yüklenecek:", file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Profil güncelleme işlemi burada yapılacak
      console.log("Profil güncellenecek:", this.profileForm.value);
    }
  }
}
