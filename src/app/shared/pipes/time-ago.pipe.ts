import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeAgo",
  standalone: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date): string {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(value).getTime()) / 1000
    );

    if (seconds < 60) return "Az önce";

    const intervals = {
      yıl: 31536000,
      ay: 2592000,
      hafta: 604800,
      gün: 86400,
      saat: 3600,
      dakika: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit} önce`;
      }
    }
    return "Az önce";
  }
}
