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

  getAvatarColor(id: number): string {
    const colors = [
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#9E9E9E",
      "#607D8B",
    ];

    return colors[id % colors.length];
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
}
