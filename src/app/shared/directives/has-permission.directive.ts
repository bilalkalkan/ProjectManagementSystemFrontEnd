import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { ProjectRole, ProjectPermission } from "../../core/models/role.model";
import { RoleService } from "../../core/services/role.service";

@Directive({
  selector: "[appHasPermission]",
  standalone: true,
})
export class HasPermissionDirective implements OnInit {
  private requiredPermission: keyof ProjectPermission | undefined;
  private currentRole: ProjectRole | undefined;
  private isHidden = true;

  @Input() set appHasPermission(permission: keyof ProjectPermission) {
    this.requiredPermission = permission;
    this.updateView();
  }

  // Rol parametresi
  @Input("role") set appHasPermissionRole(role: ProjectRole) {
    this.currentRole = role;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    if (!this.requiredPermission || this.currentRole === undefined) {
      if (!this.isHidden) {
        this.viewContainer.clear();
        this.isHidden = true;
      }
      return;
    }

    const hasPermission = this.roleService.hasPermission(
      this.currentRole,
      this.requiredPermission
    );

    if (hasPermission && this.isHidden) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isHidden = false;
    } else if (!hasPermission && !this.isHidden) {
      this.viewContainer.clear();
      this.isHidden = true;
    }
  }
}
