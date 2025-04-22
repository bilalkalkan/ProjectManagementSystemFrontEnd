import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ProjectRole } from '../../core/models/role.model';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  private requiredRoles: ProjectRole[] = [];
  private currentRole: ProjectRole | undefined;
  private isHidden = true;

  @Input() set appHasRole(roles: ProjectRole | ProjectRole[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
  }

  @Input() set appHasRoleCurrentRole(role: ProjectRole) {
    this.currentRole = role;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    if (!this.currentRole) {
      if (!this.isHidden) {
        this.viewContainer.clear();
        this.isHidden = true;
      }
      return;
    }

    const hasRequiredRole = this.requiredRoles.includes(this.currentRole);

    if (hasRequiredRole && this.isHidden) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isHidden = false;
    } else if (!hasRequiredRole && !this.isHidden) {
      this.viewContainer.clear();
      this.isHidden = true;
    }
  }
}
