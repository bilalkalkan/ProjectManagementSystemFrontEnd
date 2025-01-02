import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TaskService, Task } from "../../services/task.service";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="task-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? "Görevi Düzenle" : "Yeni Görev" }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Başlık</mat-label>
              <input
                matInput
                formControlName="title"
                placeholder="Görev başlığı"
              />
              <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                Başlık zorunludur
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Açıklama</mat-label>
              <textarea
                matInput
                formControlName="description"
                placeholder="Görev açıklaması"
                rows="4"
              ></textarea>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Durum</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="TODO">Yapılacak</mat-option>
                  <mat-option value="IN_PROGRESS">Devam Ediyor</mat-option>
                  <mat-option value="DONE">Tamamlandı</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Öncelik</mat-label>
                <mat-select formControlName="priority">
                  <mat-option value="HIGH">Yüksek</mat-option>
                  <mat-option value="MEDIUM">Orta</mat-option>
                  <mat-option value="LOW">Düşük</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Bitiş Tarihi</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  formControlName="dueDate"
                />
                <mat-datepicker-toggle
                  matSuffix
                  [for]="picker"
                ></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>İlerleme (%)</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="progress"
                  min="0"
                  max="100"
                />
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="..">İptal</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="taskForm.invalid"
              >
                {{ isEditMode ? "Güncelle" : "Oluştur" }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .task-form-container {
        padding: 24px;
        max-width: 800px;
        margin: 0 auto;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }

      .form-row {
        display: flex;
        gap: 16px;

        mat-form-field {
          flex: 1;
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }
    `,
  ],
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId?: number;
  projectId = 0;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      status: ["TODO"],
      priority: ["MEDIUM"],
      dueDate: [null],
      progress: [0],
    });
  }

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get("id"));
    if (this.taskId) {
      this.isEditMode = true;
      this.loadTask();
    }
    this.route.queryParams.subscribe((params) => {
      this.projectId = Number(params["projectId"]);
    });
  }

  loadTask() {
    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe((task) => {
        this.taskForm.patchValue(task);
      });
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const task = {
        ...this.taskForm.value,
        projectId: this.projectId,
      };

      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(this.taskId, task).subscribe({
          next: () => {
            this.router.navigate(["../../board"], {
              relativeTo: this.route,
              queryParams: { projectId: this.projectId },
            });
          },
          error: (error) => console.error("Güncelleme hatası:", error),
        });
      } else {
        this.taskService.createTask(task).subscribe({
          next: () => {
            this.router.navigate(["../board"], {
              relativeTo: this.route,
              queryParams: { projectId: this.projectId },
            });
          },
          error: (error) => console.error("Oluşturma hatası:", error),
        });
      }
    }
  }
}
