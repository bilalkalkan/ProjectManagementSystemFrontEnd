export interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "USER" | "PROJECT_MANAGER";
  avatarUrl?: string;
}
