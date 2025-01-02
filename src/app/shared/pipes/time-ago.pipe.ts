import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeAgo",
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "az önce";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} dakika önce`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} gün önce`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ay önce`;

    const years = Math.floor(months / 12);
    return `${years} yıl önce`;
  }
}
