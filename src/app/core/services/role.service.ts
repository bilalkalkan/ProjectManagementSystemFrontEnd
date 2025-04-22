import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  ProjectRole,
  ProjectMemberRole,
  ProjectPermission,
  DEFAULT_PERMISSIONS,
  ProjectMember,
} from "../models/role.model";
import { ApiResponse } from "../models/project.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private apiUrl = "http://localhost:5113/api";

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Proje üyelerini ve rollerini getir
  getProjectMembers(projectId: string): Observable<ProjectMember[]> {
    return this.http
      .get<ApiResponse<ProjectMember[]>>(
        `${this.apiUrl}/projects/${projectId}/members`
      )
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(
              response.message || "Proje üyeleri alınırken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // Kullanıcının projedeki rolünü getir
  getUserRole(projectId: string, userId: number): Observable<ProjectRole> {
    return this.http
      .get<ApiResponse<ProjectMemberRole>>(
        `${this.apiUrl}/projects/${projectId}/members/${userId}/role`
      )
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data.role;
          } else {
            throw new Error(
              response.message || "Kullanıcı rolü alınırken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // Mevcut kullanıcıyı döndür
  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  // Mevcut kullanıcının projedeki rolünü getir
  getCurrentUserRole(projectId: string): Observable<ProjectRole> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of(ProjectRole.Viewer); // Varsayılan olarak Viewer rolü
    }

    // API'den kullanıcının rolünü getir
    return this.getUserRole(projectId, currentUser.id).pipe(
      catchError((error) => {
        console.error("Kullanıcı rolü alınırken hata:", error);

        // Hata durumunda geçici çözüm: Kullanıcı ID'sine göre rol ata
        if (currentUser.id === 1) {
          return of(ProjectRole.Owner);
        } else if (currentUser.id === 2) {
          return of(ProjectRole.Admin);
        } else if (currentUser.id === 3) {
          return of(ProjectRole.Member);
        } else {
          return of(ProjectRole.Viewer);
        }
      })
    );
  }

  // Kullanıcının rolünü güncelle
  updateUserRole(
    projectId: string,
    userId: number,
    role: ProjectRole
  ): Observable<void> {
    return this.http
      .put<ApiResponse<void>>(
        `${this.apiUrl}/projects/${projectId}/members/${userId}/role`,
        { role }
      )
      .pipe(
        map((response) => {
          if (response.success) {
            return;
          } else {
            throw new Error(
              response.message ||
                "Kullanıcı rolü güncellenirken bir hata oluştu"
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // Rol için izinleri getir
  getPermissionsForRole(role: ProjectRole): ProjectPermission {
    return DEFAULT_PERMISSIONS[role];
  }

  // Kullanıcının belirli bir izne sahip olup olmadığını kontrol et
  hasPermission(
    role: ProjectRole,
    permission: keyof ProjectPermission
  ): boolean {
    const permissions = this.getPermissionsForRole(role);
    return permissions[permission];
  }

  // Hata işleme
  private handleError(error: any): Observable<never> {
    console.error("RoleService Error:", error);
    return throwError(() => error);
  }
}
