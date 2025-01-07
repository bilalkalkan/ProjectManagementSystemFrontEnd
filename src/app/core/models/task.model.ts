import { User } from "./user.model";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date;
  assigneeId: number;
  createdAt: Date;
  updatedAt: Date;
}
