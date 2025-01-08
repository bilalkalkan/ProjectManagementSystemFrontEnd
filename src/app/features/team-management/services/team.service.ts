import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { TeamMember } from "../../../core/models/team-member.model";

@Injectable({
  providedIn: "root",
})
export class TeamService {
  private mockTeamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      role: "Takım Lideri",
      department: "Yazılım Geliştirme",
      avatarUrl: "assets/avatars/avatar1.png",
      status: "active",
      joinDate: new Date("2023-01-15"),
      skills: ["Angular", "TypeScript", "Node.js"],
      assignedProjects: [1, 2, 3],
    },
    // Diğer takım üyeleri...
  ];

  getTeamMembers(): Observable<TeamMember[]> {
    return of(this.mockTeamMembers);
  }

  getTeamMember(id: number): Observable<TeamMember | undefined> {
    return of(this.mockTeamMembers.find((member) => member.id === id));
  }

  addTeamMember(member: Omit<TeamMember, "id">): Observable<TeamMember> {
    const newMember = {
      ...member,
      id: this.mockTeamMembers.length + 1,
    };
    this.mockTeamMembers.push(newMember);
    return of(newMember);
  }

  updateTeamMember(
    id: number,
    updates: Partial<TeamMember>
  ): Observable<TeamMember> {
    const index = this.mockTeamMembers.findIndex((member) => member.id === id);
    if (index !== -1) {
      this.mockTeamMembers[index] = {
        ...this.mockTeamMembers[index],
        ...updates,
      };
      return of(this.mockTeamMembers[index]);
    }
    throw new Error("Üye bulunamadı");
  }

  deleteTeamMember(id: number): Observable<void> {
    const index = this.mockTeamMembers.findIndex((member) => member.id === id);
    if (index !== -1) {
      this.mockTeamMembers.splice(index, 1);
    }
    return of(void 0);
  }
}
