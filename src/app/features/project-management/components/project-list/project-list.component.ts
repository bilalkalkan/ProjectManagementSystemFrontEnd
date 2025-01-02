import { Component, OnInit } from "@angular/core";
import { Project } from "../../../../core/models/project.model";
import { ProjectService } from "../../services/project.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { AvatarService } from "../../../../core/services/avatar.service";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-project-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
  ],
  template: `
    <div class="project-list-container">
      <div class="header">
        <div class="title-section">
          <h1>Projeler</h1>
          <div class="filters">
            <mat-button-toggle-group [(ngModel)]="statusFilter">
              <mat-button-toggle value="all">Tümü</mat-button-toggle>
              <mat-button-toggle value="ACTIVE">Aktif</mat-button-toggle>
              <mat-button-toggle value="ON_HOLD">Beklemede</mat-button-toggle>
            </mat-button-toggle-group>
            <mat-form-field appearance="outline" class="search-field">
              <mat-icon matPrefix>search</mat-icon>
              <input
                matInput
                [(ngModel)]="searchText"
                placeholder="Proje ara..."
              />
            </mat-form-field>
          </div>
        </div>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon>
          Yeni Proje
        </button>
      </div>

      <div class="project-grid">
        <mat-card *ngFor="let project of filteredProjects" class="project-card">
          <mat-card-header>
            <mat-card-title>{{ project.title }}</mat-card-title>
            <mat-chip-set>
              <mat-chip
                [color]="project.status === 'ACTIVE' ? 'primary' : 'warn'"
              >
                {{ project.status }}
              </mat-chip>
            </mat-chip-set>
          </mat-card-header>

          <mat-card-content>
            <p class="description">{{ project.description }}</p>

            <div class="project-info">
              <div class="info-item">
                <mat-icon>event</mat-icon>
                <span>{{ project.dueDate | date }}</span>
              </div>
              <div class="info-item">
                <mat-icon>group</mat-icon>
                <span>{{ project.members.length }} Üye</span>
              </div>
            </div>

            <div class="progress-section">
              <div class="progress-label">
                <span>İlerleme</span>
                <span>%{{ project.progress }}</span>
              </div>
              <mat-progress-bar
                mode="determinate"
                [value]="project.progress"
                [color]="project.status === 'ACTIVE' ? 'primary' : 'warn'"
              ></mat-progress-bar>
            </div>

            <div class="members-preview">
              <img
                *ngFor="let memberId of project.members.slice(0, 3)"
                [src]="avatarService.getAvatarUrl(memberId)"
                [alt]="'Üye ' + memberId"
                class="member-avatar"
              />
              <div class="more-members" *ngIf="project.members.length > 3">
                +{{ project.members.length - 3 }}
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button [routerLink]="[project.id]">
              <mat-icon>visibility</mat-icon>
              Detaylar
            </button>
            <button mat-button [routerLink]="[project.id, 'board']">
              <mat-icon>dashboard</mat-icon>
              Görev Tahtası
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .project-list-container {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
      }

      .title-section {
        display: flex;
        flex-direction: column;
        gap: 16px;

        h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 500;
        }
      }

      .filters {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .search-field {
        width: 300px;
      }

      .project-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 24px;
      }

      .project-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s;

        &:hover {
          transform: translateY(-4px);
        }
      }

      .description {
        margin: 16px 0;
        color: rgba(0, 0, 0, 0.6);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .project-info {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 4px;
        color: rgba(0, 0, 0, 0.6);

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .progress-section {
        margin: 16px 0;
      }

      .progress-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
      }

      .members-preview {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 16px 0;
      }

      .member-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        margin-left: -8px;

        &:first-child {
          margin-left: 0;
        }
      }

      .more-members {
        background: #e0e0e0;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
      }

      mat-card-actions {
        margin-top: auto;
        padding: 8px;
        display: flex;
        justify-content: flex-end;
      }

      @media (max-width: 600px) {
        .header {
          flex-direction: column;
          align-items: stretch;
          gap: 16px;
        }

        .filters {
          flex-direction: column;
        }

        .search-field {
          width: 100%;
        }

        .project-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProjectListComponent implements OnInit {
  statusFilter = "all";
  searchText = "";
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    public avatarService: AvatarService
  ) {}

  ngOnInit() {
    this.projectService
      .getProjects()
      .subscribe((projects) => (this.projects = projects));
  }

  get filteredProjects() {
    return this.projects.filter((project) => {
      const matchesStatus =
        this.statusFilter === "all" || project.status === this.statusFilter;
      const matchesSearch =
        !this.searchText ||
        project.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        project.description
          .toLowerCase()
          .includes(this.searchText.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }
}
