import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, delay } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem("currentUser") || "null")
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Mock login - gerçek API yerine geçici olarak kullanılacak
  login(email: string, password: string) {
    // Mock user
    const mockUser: User = {
      id: 1,
      username: "testuser",
      email: email,
      role: "USER",
      avatarUrl: "https://via.placeholder.com/150",
    };

    return of(mockUser).pipe(
      delay(1000), // API çağrısını simüle etmek için 1 saniyelik gecikme
      map((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  // Mock register
  register(user: any) {
    return of({ success: true }).pipe(delay(1000));
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
