import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TeamMember } from "../../../../core/models/team-member.model";
import { TeamService } from "../../services/team.service";

@Component({
  selector: "app-team-member-form",
  templateUrl: "./team-member-form.component.html",
  styleUrls: ["./team-member-form.component.scss"],
  standalone: false,
})
export class TeamMemberFormComponent {
  memberForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private dialogRef: MatDialogRef<TeamMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamMember
  ) {
    this.isEditMode = !!data;
    this.memberForm = this.fb.group({
      name: [data?.name || "", Validators.required],
      email: [data?.email || "", [Validators.required, Validators.email]],
      role: [data?.role || "", Validators.required],
      department: [data?.department || "", Validators.required],
      status: [data?.status || "active"],
    });
  }

  onSubmit() {
    if (this.memberForm.valid) {
      if (this.isEditMode) {
        this.teamService
          .updateTeamMember(this.data.id, this.memberForm.value)
          .subscribe(() => this.dialogRef.close(true));
      } else {
        this.teamService
          .addTeamMember(this.memberForm.value)
          .subscribe(() => this.dialogRef.close(true));
      }
    }
  }
}
