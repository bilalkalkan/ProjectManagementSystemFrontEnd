import { User } from "./user.model";

export interface Project {
  id: number;
  title: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  dueDate: Date;
  progress: number;
  members: number[];
}
