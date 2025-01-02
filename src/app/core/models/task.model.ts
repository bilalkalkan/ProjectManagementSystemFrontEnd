import { User } from "./user.model";

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  assignedTo: User;
  dueDate: Date;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}
