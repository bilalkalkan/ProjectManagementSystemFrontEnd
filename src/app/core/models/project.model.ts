import { User } from "./user.model";
import { Task } from "./task.model";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  progress: number;
  members: number[];
  completedTasks: number;
  totalTasks: number;
  tasks?: Task[];
  createdAt: Date;
  updatedAt: Date;
}
