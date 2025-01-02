import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { User } from "../../../../core/models/user.model";
import { AuthService } from "../../../../core/services/auth.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-add-member-dialog",
  template: `
    <h2 mat-dialog-title>Üye Ekle</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Üye Seç</mat-label>
        <mat-select [(ngModel)]="selectedUserId">
          <mat-option *ngFor="let user of availableUsers" [value]="user.id">
            {{ user.username }} ({{ user.email }})
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">İptal</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!selectedUserId"
        (click)="onConfirm()"
      >
        Ekle
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class AddMemberDialogComponent {
  availableUsers: User[] = [];
  selectedUserId: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddMemberDialogComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { currentMembers: number[] }
  ) {
    // Mock kullanıcı listesi
    this.availableUsers = [
      {
        id: 1,
        username: "user1",
        email: "user1@example.com",
        role: "USER" as const,
        avatarUrl: "",
      },
      {
        id: 2,
        username: "user2",
        email: "user2@example.com",
        role: "USER" as const,
        avatarUrl: "",
      },
      {
        id: 3,
        username: "user3",
        email: "user3@example.com",
        role: "USER" as const,
        avatarUrl: "",
      },
    ].filter((user) => !data.currentMembers.includes(user.id));
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    if (this.selectedUserId) {
      this.dialogRef.close(this.selectedUserId);
    }
  }
}
