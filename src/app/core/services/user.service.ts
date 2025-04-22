import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { User } from "../models/user.model";
import { ApiResponse } from "../models/project.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "http://localhost:5113/api";

  // Mock kullanıcı listesi
  private mockUsers: User[] = [
    {
      id: 1,
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      role: "ADMIN",
      avatarUrl: "",
    },
    {
      id: 2,
      username: "manager",
      firstName: "Project",
      lastName: "Manager",
      email: "manager@example.com",
      role: "USER",
      avatarUrl: "",
    },
    {
      id: 3,
      username: "developer",
      firstName: "Software",
      lastName: "Developer",
      email: "developer@example.com",
      role: "USER",
      avatarUrl: "",
    },
    {
      id: 4,
      username: "designer",
      firstName: "UI/UX",
      lastName: "Designer",
      email: "designer@example.com",
      role: "USER",
      avatarUrl: "",
    },
    {
      id: 5,
      username: "tester",
      firstName: "QA",
      lastName: "Tester",
      email: "tester@example.com",
      role: "USER",
      avatarUrl: "",
    },
  ];

  constructor(private http: HttpClient) {}

  // Tüm kullanıcıları getir
  getUsers(): Observable<User[]> {
    // API hazır olduğunda aşağıdaki kodu kullan
    /*
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Kullanıcılar alınırken bir hata oluştu');
          }
        }),
        catchError(this.handleError)
      );
    */

    // Geçici olarak mock veri kullan
    return of(this.mockUsers);
  }

  // Belirli bir kullanıcıyı getir
  getUser(id: number): Observable<User> {
    // API hazır olduğunda aşağıdaki kodu kullan
    /*
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/${id}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Kullanıcı alınırken bir hata oluştu');
          }
        }),
        catchError(this.handleError)
      );
    */

    // Geçici olarak mock veri kullan
    const user = this.mockUsers.find((u) => u.id === id);
    if (user) {
      return of(user);
    } else {
      return throwError(() => new Error("Kullanıcı bulunamadı"));
    }
  }

  // Kullanıcı ara
  searchUsers(term: string): Observable<User[]> {
    // API hazır olduğunda aşağıdaki kodu kullan
    /*
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users/search?term=${term}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Kullanıcı araması yapılırken bir hata oluştu');
          }
        }),
        catchError(this.handleError)
      );
    */

    // Geçici olarak mock veri kullan
    const searchTermLower = term.toLowerCase();
    const filteredUsers = this.mockUsers.filter(
      (user) =>
        (user.firstName?.toLowerCase() || "").includes(searchTermLower) ||
        (user.lastName?.toLowerCase() || "").includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower) ||
        user.username.toLowerCase().includes(searchTermLower)
    );
    return of(filteredUsers);
  }

  // Hata işleme
  private handleError(error: any): Observable<never> {
    console.error("UserService Error:", error);
    return throwError(() => error);
  }
}
