import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Projeyi Sil</h2>
    <mat-dialog-content>
      <p>
        <strong>{{ data.projectName }}</strong> projesini silmek istediğinizden emin misiniz?
      </p>
      <p class="warning">
        Bu işlem geri alınamaz ve projeye ait tüm görevler de silinecektir.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>İptal</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Projeyi Sil
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .warning {
      color: #f44336;
      font-weight: 500;
    }
  `]
})
export class DeleteProjectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectName: string }
  ) {}
}
