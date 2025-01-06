import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  standalone: false,
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ["", Validators.required],
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      bio: [""],
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        username: this.currentUser.username,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        bio: this.currentUser.bio,
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // TODO: Avatar yükleme işlemi
      this.snackBar.open("Avatar güncellendi", "Tamam", {
        duration: 3000,
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid && this.profileForm.dirty) {
      // TODO: Profil güncelleme işlemi
      this.snackBar.open("Profil bilgileri güncellendi", "Tamam", {
        duration: 3000,
      });
    }
  }

  resetForm() {
    this.ngOnInit();
    this.profileForm.markAsPristine();
  }
}
