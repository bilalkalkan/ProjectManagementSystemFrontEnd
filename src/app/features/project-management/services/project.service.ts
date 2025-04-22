import { Injectable } from "@angular/core";
import { Observable, of, throwError, forkJoin } from "rxjs";
import { map, catchError, switchMap, tap } from "rxjs/operators";
import {
  Project,
  ApiResponse,
  ProjectStatus,
} from "../../../core/models/project.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { RoleService } from "../../../core/services/role.service";
import { ProjectRole, ProjectMember } from "../../../core/models/role.model";
import { AuthService } from "../../../core/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private apiUrl = "http://localhost:5113/api"; // API endpoint
  public projects: Project[] = [
    {
      id: "1",
      name: "E-ticaret Platformu",
      title: "E-ticaret Platformu",
      description: "Online alışveriş platformunun geliştirilmesi",
      status: ProjectStatus.InProgress,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-06-30"),
      dueDate: new Date("2024-06-30"),
      progress: 35,
      members: [1, 2],
      teamMembersCount: 2,
      completedTasks: 5,
      totalTasks: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Mobil Uygulama",
      title: "Mobil Uygulama",
      description: "iOS ve Android için mobil uygulama geliştirme",
      status: ProjectStatus.InProgress,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-07-15"),
      dueDate: new Date("2024-07-15"),
      progress: 20,
      members: [1, 3],
      teamMembersCount: 2,
      completedTasks: 3,
      totalTasks: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "CRM Sistemi",
      title: "CRM Sistemi",
      description: "Müşteri ilişkileri yönetim sistemi",
      status: ProjectStatus.NotStarted,
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-08-30"),
      dueDate: new Date("2024-08-30"),
      progress: 0,
      members: [2, 3],
      teamMembersCount: 2,
      completedTasks: 0,
      totalTasks: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor(
    private http: HttpClient,
    private roleService: RoleService,
    private authService: AuthService
  ) {}

  // API'den projeleri getir
  getProjects(): Observable<Project[]> {
    return this.http
      .get<ApiResponse<Project[]>>(`${this.apiUrl}/projects`)
      .pipe(
        map((response) => {
          if (response.success) {
            // API'den gelen verileri dönüştür
            return response.data.map((project) => this.mapProject(project));
          } else {
            throw new Error(
              response.message || "Projeler alınırken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // API'den belirli bir projeyi getir
  getProject(id: string): Observable<Project> {
    // Önce yerel veri kaynağından projeyi bul
    const localProject = this.projects.find((p) => p.id === id);

    // API'den veri almayı dene
    return this.http
      .get<ApiResponse<Project>>(`${this.apiUrl}/projects/${id}`)
      .pipe(
        map((response) => {
          if (response.success) {
            return this.mapProject(response.data);
          } else {
            throw new Error(
              response.message || "Proje alınırken bir hata oluştu"
            );
          }
        }),
        // Proje üyelerini ve mevcut kullanıcının rolünü getir
        switchMap((project) => {
          // Rol ve üye bilgilerini almayı dene
          try {
            return forkJoin([
              // Proje üyelerini getir (hata olursa boş dizi döndür)
              this.roleService.getProjectMembers(project.id).pipe(
                catchError((error) => {
                  console.error("Proje üyeleri alınırken hata:", error);
                  return of([]);
                })
              ),
              // Mevcut kullanıcının rolünü getir (hata olursa Viewer rolü döndür)
              this.roleService.getCurrentUserRole(project.id).pipe(
                catchError((error) => {
                  console.error("Kullanıcı rolü alınırken hata:", error);
                  return of(ProjectRole.Viewer);
                })
              ),
            ]).pipe(
              map(([members, currentUserRole]) => {
                // Proje nesnesine üyeleri ve rolü ekle
                project.projectMembers = members;
                project.currentUserRole = currentUserRole;
                return project;
              }),
              catchError((error) => {
                console.error("Proje üyeleri veya rol alınırken hata:", error);
                // Hata olsa bile projeyi döndür
                return of(project);
              })
            );
          } catch (error) {
            console.error(
              "Rol ve üye bilgileri alınırken beklenmeyen hata:",
              error
            );
            return of(project);
          }
        }),
        catchError((error) => {
          console.error("API hatası, yerel veri kullanılıyor:", error);
          // API hata verirse ve yerel proje varsa onu döndür
          if (localProject) {
            // Yerel projeye varsayılan rol ekle
            const projectWithRole = {
              ...localProject,
              currentUserRole: ProjectRole.Owner,
            };
            return of(projectWithRole);
          }
          return this.handleError(error);
        })
      );
  }

  // Hata işleme metodu
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Bir hata oluştu";

    if (error.error instanceof ErrorEvent) {
      // İstemci tarafında oluşan hata
      errorMessage = `Hata: ${error.error.message}`;
    } else {
      // Backend tarafından dönen hata
      errorMessage = `${error.status}: ${
        error.error?.message || error.statusText
      }`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // API'den gelen proje verisini uygulama formatına dönüştür
  private mapProject(apiProject: any): Project {
    return {
      id: apiProject.id.toString(),
      name: apiProject.name,
      title: apiProject.name, // Geriye uyumluluk için
      description: apiProject.description,
      status: apiProject.status,
      startDate: new Date(apiProject.startDate),
      endDate: new Date(apiProject.endDate),
      dueDate: new Date(apiProject.endDate), // Geriye uyumluluk için
      progress: this.calculateProgress(
        apiProject.completedTasks,
        apiProject.totalTasks
      ),
      teamMembersCount: apiProject.teamMembersCount,
      completedTasks: apiProject.completedTasks,
      totalTasks: apiProject.totalTasks,
      members: [], // API'den üye bilgisi gelene kadar boş dizi
    };
  }

  // İlerleme yüzdesini hesapla
  private calculateProgress(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  updateProjectStatus(
    id: string,
    status: ProjectStatus | string
  ): Observable<void> {
    // API'ye gönderilecek durum değerini hazırla
    let statusValue: number;

    if (typeof status === "string") {
      // String durumları enum değerlerine dönüştür
      switch (status) {
        case "ACTIVE":
          statusValue = ProjectStatus.InProgress;
          break;
        case "ON_HOLD":
          statusValue = ProjectStatus.OnHold;
          break;
        case "COMPLETED":
          statusValue = ProjectStatus.Completed;
          break;
        case "PLANNED":
          statusValue = ProjectStatus.NotStarted;
          break;
        default:
          statusValue = ProjectStatus.InProgress;
      }
    } else {
      // Zaten enum ise doğrudan kullan
      statusValue = status;
    }

    return this.http
      .put<ApiResponse<void>>(`${this.apiUrl}/projects/${id}/status`, {
        status: statusValue,
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return;
          } else {
            throw new Error(
              response.message || "Proje durumu güncellenirken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  updateProject(id: string, updates: Partial<Project>): Observable<Project> {
    // API'ye gönderilecek veriyi hazırla
    const projectData = {
      name: updates.title || updates.name || "",
      description: updates.description || "",
      startDate: updates.startDate || new Date(),
      endDate: updates.dueDate || updates.endDate || new Date(),
      status:
        typeof updates.status === "number"
          ? updates.status
          : ProjectStatus.InProgress,
    };

    return this.http
      .put<ApiResponse<Project>>(`${this.apiUrl}/projects/${id}`, projectData)
      .pipe(
        map((response) => {
          if (response.success) {
            return this.mapProject(response.data);
          } else {
            throw new Error(
              response.message || "Proje güncellenirken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  createProject(project: Partial<Project>): Observable<Project> {
    // API'ye gönderilecek veriyi hazırla
    const projectData = {
      name: project.title || project.name || "",
      description: project.description || "",
      startDate: project.startDate || new Date(),
      endDate:
        project.dueDate ||
        project.endDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
      status: ProjectStatus.NotStarted,
    };

    return this.http
      .post<ApiResponse<Project>>(`${this.apiUrl}/projects`, projectData)
      .pipe(
        map((response) => {
          if (response.success) {
            return this.mapProject(response.data);
          } else {
            throw new Error(
              response.message || "Proje oluşturulurken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  addMember(projectId: string, memberId: number): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(`${this.apiUrl}/projects/${projectId}/members`, {
        userId: memberId,
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return;
          } else {
            throw new Error(
              response.message || "Üye eklenirken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  removeMember(projectId: string, memberId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(
        `${this.apiUrl}/projects/${projectId}/members/${memberId}`
      )
      .pipe(
        map((response) => {
          if (response.success) {
            return;
          } else {
            throw new Error(
              response.message || "Üye kaldırılırken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  deleteProject(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/projects/${id}`)
      .pipe(
        map((response) => {
          if (response.success) {
            return;
          } else {
            throw new Error(
              response.message || "Proje silinirken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // Proje üyelerini getir (eski metot, artık RoleService kullanılıyor)
  getProjectMembers(projectId: string): Observable<any[]> {
    return this.roleService.getProjectMembers(projectId);
  }

  // Kullanıcının projedeki rolünü getir
  getUserRole(projectId: string, userId: number): Observable<ProjectRole> {
    return this.roleService.getUserRole(projectId, userId);
  }

  // Mevcut kullanıcının projedeki rolünü getir
  getCurrentUserRole(projectId: string): Observable<ProjectRole> {
    return this.roleService.getCurrentUserRole(projectId);
  }

  // Kullanıcının rolünü güncelle
  updateUserRole(
    projectId: string,
    userId: number,
    role: ProjectRole
  ): Observable<void> {
    return this.roleService.updateUserRole(projectId, userId, role);
  }
}
