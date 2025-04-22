import { User } from "./user.model";
import { Task } from "./task.model";
import { ProjectMember, ProjectRole } from "./role.model";

export enum ProjectStatus {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  OnHold = 3,
  Cancelled = 4,
}

export interface Project {
  id: string;
  name: string; // API'den gelen alan
  title?: string; // Eski alan (geriye uyumluluk için)
  description: string;
  status: ProjectStatus;
  startDate: Date; // API'den gelen alan
  endDate: Date; // API'den gelen alan
  dueDate?: Date; // Eski alan (geriye uyumluluk için)
  progress?: number; // Hesaplanabilir alan
  members?: number[]; // Takım üyeleri (eski format)
  projectMembers?: ProjectMember[]; // Takım üyeleri ve rolleri
  teamMembersCount: number; // API'den gelen alan
  completedTasks: number;
  totalTasks: number;
  tasks?: Task[];
  createdAt?: Date;
  updatedAt?: Date;
  currentUserRole?: ProjectRole; // Mevcut kullanıcının rolü
}

// API'den gelen yanıt formatı
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  statusCode: number;
  errors: string[];
}
