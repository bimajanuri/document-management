// ========================================
// MOCK DATA EXPORTS
// ========================================

// Main mock data object
export { default as mockData } from './mockData';

// Individual exports for specific use cases
export {
  // Types
  type User,
  type Role,
  type RolePermission,
  type DocumentPermission,
  type RoleOption,
  type DashboardStats,
  type ActivityItem,
  type QuickAction,
  type DocumentCategory,
  type SystemStatus,
  type Document,
  type Folder,
  type UploadProgress,
  type AuditLogEntry,
  type Comment,
  type ApprovalStep,
  type Notification,
  type UserGroup,
  
  // Data
  mockUsers,
  mockRoles,
  mockRolePermissions,
  mockDocumentPermissions,
  mockRoleOptions,
  mockDashboardStats,
  mockRecentActivity,
  mockQuickActions,
  mockDocumentCategories,
  mockSystemStatus,
  mockDocuments,
  mockFolders,
  mockAuditLog,
  mockComments,
  mockApprovalHistory,
  mockNotifications,
  mockUserGroups,
  roleTemplates
} from './mockData';

// ========================================
// UTILITY FUNCTIONS FOR MOCK DATA
// ========================================

import { mockUsers, mockRoles, mockRolePermissions } from './mockData';

/**
 * Get user by ID
 */
export const getUserById = (id: string) => {
  return mockUsers.find(user => user.id === id);
};

/**
 * Get role by ID
 */
export const getRoleById = (id: string) => {
  return mockRoles.find(role => role.id === id);
};

/**
 * Get permission by ID
 */
export const getRolePermissionById = (id: string) => {
  return mockRolePermissions.find(permission => permission.id === id);
};

/**
 * Get users by role
 */
export const getUsersByRole = (roleId: string) => {
  return mockUsers.filter(user => user.role === roleId);
};

/**
 * Get role by name
 */
export const getRoleByName = (name: string) => {
  return mockRoles.find(role => role.name === name);
};

/**
 * Get permissions by category
 */
export const getRolePermissionsByCategory = (category: string) => {
  return mockRolePermissions.filter(permission => permission.category === category);
};

/**
 * Get total user count
 */
export const getTotalUserCount = () => {
  return mockUsers.length;
};

/**
 * Get total role count
 */
export const getTotalRoleCount = () => {
  return mockRoles.length;
};

/**
 * Get active users count
 */
export const getActiveUserCount = () => {
  return mockUsers.filter(user => user.status === 'active').length;
};

/**
 * Get inactive users count
 */
export const getInactiveUserCount = () => {
  return mockUsers.filter(user => user.status === 'inactive').length;
};
