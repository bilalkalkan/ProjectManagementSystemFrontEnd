export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarUrl: string;
  status: "active" | "inactive";
  joinDate: Date;
  skills: string[];
  assignedProjects: number[];
}
