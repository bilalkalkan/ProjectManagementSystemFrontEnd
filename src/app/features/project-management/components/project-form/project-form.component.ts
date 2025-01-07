import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../services/project.service";
import { AvatarService } from "../../../../core/services/avatar.service";

@Component({
  selector: "app-project-form",
  templateUrl: "./project-form.component.html",
  styleUrls: ["./project-form.component.scss"],
  standalone: false,
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  projectId?: string;

  availableMembers = [
    {
      id: 1,
      name: "Ali Yılmaz",
      role: "Frontend Developer",
      avatarUrl: this.avatarService.getAvatarUrl(1),
    },
    {
      id: 2,
      name: "Ayşe Demir",
      role: "Backend Developer",
      avatarUrl: this.avatarService.getAvatarUrl(2),
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      role: "UI/UX Designer",
      avatarUrl: this.avatarService.getAvatarUrl(3),
    },
    {
      id: 4,
      name: "Zeynep Şahin",
      role: "Project Manager",
      avatarUrl: this.avatarService.getAvatarUrl(4),
    },
    {
      id: 5,
      name: "Can Özkan",
      role: "DevOps Engineer",
      avatarUrl: this.avatarService.getAvatarUrl(5),
    },
    {
      id: 6,
      name: "Elif Yıldız",
      role: "QA Engineer",
      avatarUrl: this.avatarService.getAvatarUrl(6),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private avatarService: AvatarService
  ) {
    this.projectForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      dueDate: [null, Validators.required],
      priority: ["MEDIUM"],
      members: [[]], // Üye seçimi için yeni form kontrolü
    });
  }

  ngOnInit() {
    this.isEditMode = this.route.snapshot.data["isEdit"] === true;
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.projectId = id;
      this.projectService.getProject(id).subscribe({
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
      if (this.isEditMode && this.projectId) {
        // Güncelleme işlemi
        this.projectService
          .updateProject(this.projectId, this.projectForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(["/projects"]);
            },
            error: (error) => {
              console.error("Proje güncellenirken hata oluştu:", error);
            },
          });
      } else {
        // Yeni proje oluşturma işlemi
        this.projectService.createProject(this.projectForm.value).subscribe({
          next: () => {
            this.router.navigate(["/projects"]);
          },
          error: (error) => {
            console.error("Proje oluşturulurken hata oluştu:", error);
          },
        });
      }
    }
  }

  getSelectedMembersText(): string {
    const selectedMembers = this.projectForm.get("members")?.value || [];
    if (selectedMembers.length === 0) return "Üye seçin";
    if (selectedMembers.length === 1) {
      return this.getMemberName(selectedMembers[0]);
    }
    return `${this.getMemberName(selectedMembers[0])} ve ${
      selectedMembers.length - 1
    } diğer`;
  }

  getMemberName(id: number): string {
    return this.availableMembers.find((m) => m.id === id)?.name || "";
  }

  getMemberAvatar(id: number): string {
    return this.availableMembers.find((m) => m.id === id)?.avatarUrl || "";
  }

  removeMember(memberId: number) {
    const members = this.projectForm.get("members")?.value || [];
    this.projectForm.patchValue({
      members: members.filter((id: number) => id !== memberId),
    });
  }
}
