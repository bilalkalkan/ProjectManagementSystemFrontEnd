import { User } from "./user.model";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  progress: number;
  members: number[];
  completedTasks?: number;
  totalTasks?: number;
}
