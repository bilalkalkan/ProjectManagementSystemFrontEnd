export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  statusCode: number;
  errors: string[] | null;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  userId: number;
  userName: string;
  email: string;
  roles: string[];
}

export interface AuthResponse extends ApiResponse<AuthResponseData> {}
