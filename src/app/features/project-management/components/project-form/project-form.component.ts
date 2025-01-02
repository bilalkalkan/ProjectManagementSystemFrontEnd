import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../services/project.service";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-project-form",
  template: `
    <div class="project-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Yeni Proje Oluştur</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Proje Adı</mat-label>
              <input matInput formControlName="title" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Açıklama</mat-label>
              <textarea
                matInput
                formControlName="description"
                rows="4"
              ></textarea>
            </mat-form-field>

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

            <div class="actions">
              <button mat-raised-button type="button" routerLink="/projects">
                İptal
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!projectForm.valid"
              >
                Oluştur
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .project-form-container {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .actions {
        display: flex;
        gap: 16px;
        justify-content: flex-end;
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  projectId?: number;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.projectForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      dueDate: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.isEditMode = this.route.snapshot.data["isEdit"] === true;
    if (this.isEditMode) {
      this.projectId = Number(this.route.snapshot.paramMap.get("id"));
      this.loadProject();
    }
  }

  loadProject() {
    if (this.projectId) {
      this.projectService.getProject(this.projectId).subscribe({
        next: (project) => {
          if (project) {
            this.projectForm.patchValue({
              title: project.title,
              description: project.description,
              dueDate: project.dueDate,
            });
          }
        },
        error: (error) => {
          console.error("Proje yüklenirken hata oluştu:", error);
          this.router.navigate(["/projects"]);
        },
      });
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const operation = this.isEditMode
        ? this.projectService.updateProject(
            this.projectId!,
            this.projectForm.value
          )
        : this.projectService.createProject(this.projectForm.value);

      operation.subscribe({
        next: () => {
          this.router.navigate(["/projects"]);
        },
        error: (error) => {
          console.error(
            `Proje ${
              this.isEditMode ? "güncellenirken" : "oluşturulurken"
            } hata oluştu:`,
            error
          );
        },
      });
    }
  }
}
