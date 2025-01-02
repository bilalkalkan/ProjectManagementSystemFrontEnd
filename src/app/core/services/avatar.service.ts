import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AvatarService {
  private avatarServices = [
    (id: number) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    (id: number) => `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`,
    (id: number) => `https://api.dicebear.com/7.x/personas/svg?seed=${id}`,
  ];

  getAvatarUrl(id: number): string {
    // Kullanıcı ID'sine göre sabit bir avatar servisi seç
    const serviceIndex = id % this.avatarServices.length;
    return this.avatarServices[serviceIndex](id);
  }
}
