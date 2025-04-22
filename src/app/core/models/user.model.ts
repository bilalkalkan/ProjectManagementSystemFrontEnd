export interface User {
  id: number;
  username: string;
  userName?: string; // API'den gelen tam ad
  email: string;
  role: string; // "ADMIN" | "USER" | "PROJECT_MANAGER" gibi değerler alabilir
  avatarUrl?: string;
  name?: string; // Alternatif ad alanı
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  token?: string; // JWT token
}
