import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AvatarService } from "../../../../core/services/avatar.service";

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
    private snackBar: MatSnackBar,
    private avatarService: AvatarService
  ) {
    this.profileForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      bio: [""],
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    console.log("Current user:", this.currentUser);

    if (this.currentUser) {
      // API'den gelen kullanıcı bilgilerini forma doldur
      // Kullanıcı adını farklı alanlardan kontrol et
      let fullName = "";

      if (this.currentUser.userName) {
        fullName = this.currentUser.userName;
      } else if (this.currentUser.name) {
        fullName = this.currentUser.name;
      } else {
        // Eğer hiçbir isim alanı yoksa, email'den kullanıcı adını çıkar
        const emailParts = this.currentUser.email
          ? this.currentUser.email.split("@")
          : [""];
        fullName = emailParts[0] || "Kullanıcı";
      }

      console.log("Parsed full name:", fullName);

      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "Kullanıcı";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      console.log("First name:", firstName, "Last name:", lastName);

      this.profileForm.patchValue({
        firstName: firstName,
        lastName: lastName,
        email: this.currentUser.email || "",
        phone: this.currentUser.phone || "",
        bio: this.currentUser.bio || "",
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
      const formData = this.profileForm.value;

      // Tam adı birleştir
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      // Güncellenecek kullanıcı bilgileri
      const updatedUser = {
        userName: fullName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
      };

      console.log("Profil güncelleme:", updatedUser);

      // TODO: API'ye profil güncelleme isteği gönder
      // Şimdilik sadece başarılı mesajı göster
      this.snackBar.open("Profil bilgileri güncellendi", "Tamam", {
        duration: 3000,
      });
    }
  }

  resetForm() {
    this.ngOnInit();
    this.profileForm.markAsPristine();
  }

  getAvatarUrl(): string {
    if (this.currentUser?.avatarUrl) {
      return this.currentUser.avatarUrl;
    }

    if (this.currentUser?.id) {
      return this.avatarService.getAvatarUrl(this.currentUser.id);
    }

    // Default avatar
    return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
  }
}
