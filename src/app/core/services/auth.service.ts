import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { User } from "../models/user.model";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../models/auth.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem("currentUser") || "null")
    );
    this.currentUser = this.currentUserSubject.asObservable();

    // Sayfa yenilendiğinde token kontrolü yap
    this.autoLogin();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Mevcut kullanıcıyı döndüren metot
  public getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  login(email: string, password: string): Observable<User> {
    const loginData: LoginRequest = { email, password };

    console.log("Login request:", loginData);
    console.log("Login URL:", `${environment.authApiUrl}/login`);

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      withCredentials: false, // CORS için gerekirse true yapın
    };

    return this.http
      .post<AuthResponse>(
        `${environment.authApiUrl}/login`,
        loginData,
        httpOptions
      )
      .pipe(
        tap((response) => console.log("API Response:", response)),
        map((response) => {
          if (response.success) {
            // Token ve kullanıcı bilgilerini kaydet
            const authData = response.data;

            // API'den gelen bilgilerle User nesnesi oluştur
            console.log("API'den gelen rol:", authData.roles[0]);
            console.log("API'den gelen tüm roller:", authData.roles);

            const user: User = {
              id: authData.userId,
              username: authData.userName,
              userName: authData.userName,
              email: authData.email,
              role: authData.roles[0], // İlk rolü al ("ADMIN")
              token: authData.accessToken, // Token'i kullanıcı nesnesine ekle
            };

            console.log("Oluşturulan kullanıcı nesnesi:", user);

            // Token süresi için JWT'den expiration süresini çıkar
            const tokenExpiration = this.getTokenExpirationDate(
              authData.accessToken
            );
            const expiresIn = tokenExpiration
              ? (tokenExpiration.getTime() - new Date().getTime()) / 1000
              : 3600;

            this.handleAuthentication(
              authData.accessToken,
              expiresIn,
              user,
              authData.refreshToken
            );
            return user;
          } else {
            throw new Error(response.message || "Giriş başarısız");
          }
        }),
        catchError((error) => {
          console.error("Login error:", error);
          let errorMessage = "Giriş başarısız";

          if (error.error instanceof ErrorEvent) {
            // Client-side hata
            errorMessage = `Hata: ${error.error.message}`;
          } else if (error.status) {
            // Backend hatası
            errorMessage = `Hata Kodu: ${error.status}\nMesaj: ${
              error.error?.message || error.statusText
            }`;
          } else if (error.message) {
            errorMessage = error.message;
          }

          console.log("Formatted error message:", errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // JWT token'dan expiration date'i çıkar
  private getTokenExpirationDate(token: string): Date | null {
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) return null;

      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      if (!tokenPayload.exp) return null;

      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(tokenPayload.exp);
      return expirationDate;
    } catch (e) {
      console.error("Token expiration parsing error:", e);
      return null;
    }
  }

  register(userData: RegisterRequest): Observable<any> {
    console.log("Register request:", userData);
    console.log("Register URL:", `${environment.authApiUrl}/register`);

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      withCredentials: false, // CORS için gerekirse true yapın
    };

    return this.http
      .post<AuthResponse>(
        `${environment.authApiUrl}/register`,
        userData,
        httpOptions
      )
      .pipe(
        tap((response) => console.log("Register API Response:", response)),
        map((response) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(
              response.message || "Kayıt sırasında bir hata oluştu"
            );
          }
        }),
        catchError((error) => {
          console.error("Register error:", error);
          let errorMessage = "Kayıt sırasında bir hata oluştu";

          if (error.error instanceof ErrorEvent) {
            // Client-side hata
            errorMessage = `Hata: ${error.error.message}`;
          } else if (error.status) {
            // Backend hatası
            errorMessage = `Hata Kodu: ${error.status}\nMesaj: ${
              error.error?.message || error.statusText
            }`;
          } else if (error.message) {
            errorMessage = error.message;
          }

          console.log("Formatted register error message:", errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiration");
    this.currentUserSubject.next(null);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleAuthentication(
    token: string,
    expiresIn: number,
    user: User,
    refreshToken?: string
  ) {
    // Token süresi (saniye cinsinden)
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    // Token ve kullanıcı bilgilerini localStorage'a kaydet
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiration", expirationDate.toISOString());
    localStorage.setItem("currentUser", JSON.stringify(user));

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    // Kullanıcı bilgilerini güncelle
    this.currentUserSubject.next(user);

    // Token süresi dolduğunda otomatik çıkış yap
    this.autoLogout(expiresIn * 1000);
  }

  private autoLogin() {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "null");
    const tokenExpirationDate = localStorage.getItem("tokenExpiration");
    const token = localStorage.getItem("token");

    if (!userData || !token || !tokenExpirationDate) {
      return;
    }

    const expirationDate = new Date(tokenExpirationDate);
    const now = new Date();

    // Token süresi dolmadıysa kullanıcıyı otomatik giriş yaptır
    if (expirationDate > now) {
      this.currentUserSubject.next(userData);
      const expirationDuration = expirationDate.getTime() - now.getTime();
      this.autoLogout(expirationDuration);
    } else {
      this.logout();
    }
  }

  private autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
}
