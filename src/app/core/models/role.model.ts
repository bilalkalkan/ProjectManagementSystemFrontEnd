export enum ProjectRole {
  Owner = 0,
  Admin = 1,
  Member = 2,
  Viewer = 3
}

export interface ProjectMemberRole {
  userId: number;
  projectId: string;
  role: ProjectRole;
}

export interface ProjectPermission {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageMembers: boolean;
  canManageTasks: boolean;
  canCreateTasks: boolean;
  canAssignTasks: boolean;
  canUpdateTaskStatus: boolean;
}

export const DEFAULT_PERMISSIONS: Record<ProjectRole, ProjectPermission> = {
  [ProjectRole.Owner]: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canManageMembers: true,
    canManageTasks: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canUpdateTaskStatus: true
  },
  [ProjectRole.Admin]: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canManageMembers: true,
    canManageTasks: true,
    canCreateTasks: true,
    canAssignTasks: true,
    canUpdateTaskStatus: true
  },
  [ProjectRole.Member]: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canManageMembers: false,
    canManageTasks: false,
    canCreateTasks: true,
    canAssignTasks: false,
    canUpdateTaskStatus: true
  },
  [ProjectRole.Viewer]: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canManageMembers: false,
    canManageTasks: false,
    canCreateTasks: false,
    canAssignTasks: false,
    canUpdateTaskStatus: false
  }
};

export interface ProjectMember {
  id: number;
  userId: number;
  projectId: string;
  role: ProjectRole;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  joinedAt: Date;
}
