import { Component, OnInit } from "@angular/core";
import { TeamService } from "../../services/team.service";
import { TeamMember } from "../../../../core/models/team-member.model";
import { MatDialog } from "@angular/material/dialog";
import { TeamMemberFormComponent } from "../team-member-form/team-member-form.component";

@Component({
  selector: "app-team-list",
  templateUrl: "./team-list.component.html",
  styleUrls: ["./team-list.component.scss"],
  standalone: false,
})
export class TeamListComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  displayedColumns = [
    "avatar",
    "name",
    "role",
    "department",
    "status",
    "actions",
  ];

  constructor(private teamService: TeamService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadTeamMembers();
  }

  loadTeamMembers() {
    this.teamService.getTeamMembers().subscribe((members) => {
      this.teamMembers = members;
    });
  }

  openMemberForm(member?: TeamMember) {
    const dialogRef = this.dialog.open(TeamMemberFormComponent, {
      width: "600px",
      data: member,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTeamMembers();
      }
    });
  }

  deleteMember(id: number) {
    if (confirm("Bu üyeyi silmek istediğinizden emin misiniz?")) {
      this.teamService.deleteTeamMember(id).subscribe(() => {
        this.loadTeamMembers();
      });
    }
  }
}
