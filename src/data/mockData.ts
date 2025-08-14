// ========================================
// MOCK DATA FOR DOCUMENT MANAGEMENT SYSTEM
// ========================================

// ========================================
// USER & AUTHENTICATION DATA
// ========================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface RoleOption {
  value: string;
  label: string;
}

// ========================================
// MOCK USERS DATA
// ========================================

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "super_admin",
    status: "active",
    lastLogin: "2024-01-15 10:30 AM"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "document_manager",
    status: "active",
    lastLogin: "2024-01-14 02:15 PM"
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@company.com",
    role: "document_editor",
    status: "active",
    lastLogin: "2024-01-13 09:45 AM"
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@company.com",
    role: "document_viewer",
    status: "inactive",
    lastLogin: "2024-01-10 11:20 AM"
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie.wilson@company.com",
    role: "document_editor",
    status: "active",
    lastLogin: "2024-01-15 08:30 AM"
  }
];

// ========================================
// MOCK ROLES DATA
// ========================================

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    userCount: 2,
    permissions: ["doc_create", "doc_read", "doc_edit", "doc_delete", "user_manage", "role_manage", "system_config"]
  },
  {
    id: "2",
    name: "Document Manager",
    description: "Can manage documents and basic user operations",
    userCount: 5,
    permissions: ["doc_create", "doc_read", "doc_edit", "doc_delete", "user_manage"]
  },
  {
    id: "3",
    name: "Document Editor",
    description: "Can create, read, and edit documents",
    userCount: 12,
    permissions: ["doc_create", "doc_read", "doc_edit"]
  },
  {
    id: "4",
    name: "Document Viewer",
    description: "Can only view documents",
    userCount: 25,
    permissions: ["doc_read"]
  }
];

// ========================================
// MOCK ROLE PERMISSIONS DATA
// ========================================

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const mockRolePermissions: RolePermission[] = [
  { id: "doc_create", name: "Create Documents", description: "Can create new documents", category: "Documents" },
  { id: "doc_read", name: "Read Documents", description: "Can view documents", category: "Documents" },
  { id: "doc_edit", name: "Edit Documents", description: "Can modify documents", category: "Documents" },
  { id: "doc_delete", name: "Delete Documents", description: "Can remove documents", category: "Documents" },
  { id: "user_manage", name: "Manage Users", description: "Can manage user accounts", category: "Users" },
  { id: "role_manage", name: "Manage Roles", description: "Can manage user roles", category: "Users" },
  { id: "system_config", name: "System Configuration", description: "Can configure system settings", category: "System" },
];

// ========================================
// MOCK ROLE OPTIONS FOR FORMS
// ========================================

export const mockRoleOptions: RoleOption[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "document_manager", label: "Document Manager" },
  { value: "document_editor", label: "Document Editor" },
  { value: "document_viewer", label: "Document Viewer" }
];

// ========================================
// MOCK DASHBOARD STATISTICS
// ========================================

export interface DashboardStats {
  totalUsers: number;
  totalDocuments: number;
  activeSessions: number;
  systemHealth: string;
}

export const mockDashboardStats: DashboardStats = {
  totalUsers: 45,
  totalDocuments: 1234,
  activeSessions: 12,
  systemHealth: "Excellent"
};

// ========================================
// MOCK RECENT ACTIVITY DATA
// ========================================

export interface ActivityItem {
  id: string;
  type: "user_registered" | "document_uploaded" | "system_maintenance" | "role_updated" | "user_login";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

export const mockRecentActivity: ActivityItem[] = [
  {
    id: "1",
    type: "user_registered",
    title: "New user registered",
    description: "Alice Brown joined the system",
    timestamp: "2 hours ago",
    icon: "M12 4v16m8-8H4",
    color: "green"
  },
  {
    id: "2",
    type: "document_uploaded",
    title: "Document uploaded",
    description: "Q4_Report_2024.pdf added",
    timestamp: "4 hours ago",
    icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10",
    color: "blue"
  },
  {
    id: "3",
    type: "system_maintenance",
    title: "System maintenance",
    description: "Scheduled backup completed",
    timestamp: "6 hours ago",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z",
    color: "yellow"
  },
  {
    id: "4",
    type: "role_updated",
    title: "Role permissions updated",
    description: "Document Editor role modified",
    timestamp: "8 hours ago",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    color: "purple"
  },
  {
    id: "5",
    type: "user_login",
    title: "User login",
    description: "John Doe logged in from new device",
    timestamp: "10 hours ago",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    color: "indigo"
  }
];

// ========================================
// MOCK QUICK ACTIONS DATA
// ========================================

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
}

export const mockQuickActions: QuickAction[] = [
  {
    id: "1",
    title: "Upload Document",
    description: "Add new files to the system",
    icon: "M12 4v16m8-8H4",
    action: "upload"
  },
  {
    id: "2",
    title: "Search Documents",
    description: "Find specific files quickly",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    action: "search"
  },
  {
    id: "3",
    title: "View Reports",
    description: "System analytics and insights",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    action: "reports"
  },
  {
    id: "4",
    title: "Manage Categories",
    description: "Organize documents by type",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    action: "categories"
  },
  {
    id: "5",
    title: "User Permissions",
    description: "Manage access controls",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    action: "permissions"
  },
  {
    id: "6",
    title: "System Settings",
    description: "Configure application preferences",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    action: "settings"
  }
];

// ========================================
// MOCK DOCUMENT CATEGORIES
// ========================================

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  color: string;
}

export const mockDocumentCategories: DocumentCategory[] = [
  {
    id: "1",
    name: "Reports",
    description: "Business and financial reports",
    documentCount: 156,
    color: "blue"
  },
  {
    id: "2",
    name: "Contracts",
    description: "Legal documents and agreements",
    documentCount: 89,
    color: "green"
  },
  {
    id: "3",
    name: "Invoices",
    description: "Billing and payment documents",
    documentCount: 234,
    color: "purple"
  },
  {
    id: "4",
    name: "Manuals",
    description: "User guides and procedures",
    documentCount: 67,
    color: "orange"
  },
  {
    id: "5",
    name: "Presentations",
    description: "Slides and presentation materials",
    documentCount: 123,
    color: "red"
  }
];

// ========================================
// MOCK SYSTEM STATUS DATA
// ========================================

export interface SystemStatus {
  id: string;
  service: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  uptime: string;
  lastCheck: string;
}

export const mockSystemStatus: SystemStatus[] = [
  {
    id: "1",
    service: "Document Storage",
    status: "operational",
    uptime: "99.9%",
    lastCheck: "2 minutes ago"
  },
  {
    id: "2",
    service: "User Authentication",
    status: "operational",
    uptime: "99.8%",
    lastCheck: "1 minute ago"
  },
  {
    id: "3",
    service: "Search Engine",
    status: "operational",
    uptime: "99.7%",
    lastCheck: "3 minutes ago"
  },
  {
    id: "4",
    service: "File Processing",
    status: "operational",
    uptime: "99.6%",
    lastCheck: "2 minutes ago"
  },
  {
    id: "5",
    service: "Email Notifications",
    status: "degraded",
    uptime: "95.2%",
    lastCheck: "5 minutes ago"
  }
];

// ========================================
// MOCK DOCUMENT MANAGEMENT DATA
// ========================================

export interface Document {
  id: string;
  name: string;
  type: string;
  extension: string;
  size: number;
  date: string;
  author: string;
  version: string;
  status: "checked_in" | "checked_out" | "pending_approval" | "approved" | "rejected";
  tags: string[];
  description?: string;
  folderId: string;
  checkedOutBy?: string;
  checkedOutDate?: string;
  lastModified: string;
  downloadCount: number;
  isFavorite: boolean;
  metadata?: {
    title?: string;
    customField1?: string;
    customField2?: string;
  };
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  createdDate: string;
  documentCount: number;
  subfolderCount: number;
}

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error" | "paused";
  error?: string;
}

// Mock folders data
export const mockFolders: Folder[] = [
  {
    id: "root",
    name: "Root",
    parentId: null,
    path: "/",
    createdDate: "2024-01-01",
    documentCount: 0,
    subfolderCount: 3
  },
  {
    id: "projects",
    name: "Projects",
    parentId: "root",
    path: "/Projects",
    createdDate: "2024-01-02",
    documentCount: 2,
    subfolderCount: 2
  },
  {
    id: "2024",
    name: "2024",
    parentId: "projects",
    path: "/Projects/2024",
    createdDate: "2024-01-03",
    documentCount: 3,
    subfolderCount: 1
  },
  {
    id: "designs",
    name: "Designs",
    parentId: "2024",
    path: "/Projects/2024/Designs",
    createdDate: "2024-01-04",
    documentCount: 0,
    subfolderCount: 0
  },
  {
    id: "hr",
    name: "HR",
    parentId: "root",
    path: "/HR",
    createdDate: "2024-01-05",
    documentCount: 4,
    subfolderCount: 0
  },
  {
    id: "specs",
    name: "Specs",
    parentId: "root",
    path: "/Specs",
    createdDate: "2024-01-06",
    documentCount: 2,
    subfolderCount: 0
  }
];

// Mock documents data
export const mockDocuments: Document[] = [
  {
    id: "doc_001",
    name: "Document1.pdf",
    type: "PDF Document",
    extension: "pdf",
    size: 2048576, // 2MB
    date: "2024-06-01",
    author: "Jane Doe",
    version: "v1.0",
    status: "checked_in",
    tags: ["contract", "legal"],
    description: "Important contract document for Q2 2024",
    folderId: "projects",
    lastModified: "2024-06-01T10:30:00Z",
    downloadCount: 15,
    isFavorite: true,
    metadata: {
      title: "Q2 Contract Document",
      customField1: "High Priority",
      customField2: "Legal Review Required"
    }
  },
  {
    id: "doc_002",
    name: "Report.docx",
    type: "DOCX Document",
    extension: "docx",
    size: 1536000, // 1.5MB
    date: "2024-05-28",
    author: "John Smith",
    version: "v2.1",
    status: "checked_out",
    tags: ["report", "quarterly"],
    description: "Quarterly business report",
    folderId: "projects",
    checkedOutBy: "John Smith",
    checkedOutDate: "2024-06-15T14:20:00Z",
    lastModified: "2024-05-28T16:45:00Z",
    downloadCount: 8,
    isFavorite: false,
    metadata: {
      title: "Q1 Business Report",
      customField1: "Finance Department",
      customField2: "Executive Review"
    }
  },
  {
    id: "doc_003",
    name: "Image.png",
    type: "PNG Image",
    extension: "png",
    size: 512000, // 500KB
    date: "2024-05-20",
    author: "Alex Lee",
    version: "v1.0",
    status: "approved",
    tags: ["design", "marketing"],
    description: "Marketing banner design",
    folderId: "2024",
    lastModified: "2024-05-20T09:15:00Z",
    downloadCount: 23,
    isFavorite: true,
    metadata: {
      title: "Marketing Banner v1",
      customField1: "Marketing Team",
      customField2: "Campaign Q2"
    }
  },
  {
    id: "doc_004",
    name: "Proposal.pdf",
    type: "PDF Document",
    extension: "pdf",
    size: 3145728, // 3MB
    date: "2024-06-01",
    author: "Jane Doe",
    version: "v3.0",
    status: "checked_in",
    tags: ["contract", "urgent"],
    description: "Project proposal for new client",
    folderId: "2024",
    lastModified: "2024-06-01T11:30:00Z",
    downloadCount: 5,
    isFavorite: false,
    metadata: {
      title: "Client Project Proposal",
      customField1: "Sales Department",
      customField2: "Urgent Review"
    }
  },
  {
    id: "doc_005",
    name: "Specs.docx",
    type: "DOCX Document",
    extension: "docx",
    size: 1048576, // 1MB
    date: "2024-05-28",
    author: "John Smith",
    version: "v1.0",
    status: "checked_out",
    tags: ["specs", "technical"],
    description: "Technical specifications document",
    folderId: "specs",
    checkedOutBy: "John Smith",
    checkedOutDate: "2024-06-10T08:00:00Z",
    lastModified: "2024-05-28T13:22:00Z",
    downloadCount: 12,
    isFavorite: false,
    metadata: {
      title: "System Specifications v1",
      customField1: "Development Team",
      customField2: "Architecture Review"
    }
  },
  {
    id: "doc_006",
    name: "Employee_Handbook.pdf",
    type: "PDF Document",
    extension: "pdf",
    size: 4194304, // 4MB
    date: "2024-01-15",
    author: "HR Department",
    version: "v2.0",
    status: "approved",
    tags: ["hr", "policy"],
    description: "Updated employee handbook for 2024",
    folderId: "hr",
    lastModified: "2024-01-15T10:00:00Z",
    downloadCount: 156,
    isFavorite: true,
    metadata: {
      title: "Employee Handbook 2024",
      customField1: "HR Department",
      customField2: "Annual Update"
    }
  },
  {
    id: "doc_007",
    name: "Budget_Q2.xlsx",
    type: "Excel Spreadsheet",
    extension: "xlsx",
    size: 2097152, // 2MB
    date: "2024-04-01",
    author: "Finance Team",
    version: "v1.5",
    status: "pending_approval",
    tags: ["budget", "finance"],
    description: "Q2 budget planning spreadsheet",
    folderId: "hr",
    lastModified: "2024-04-01T14:30:00Z",
    downloadCount: 7,
    isFavorite: false,
    metadata: {
      title: "Q2 Budget Plan",
      customField1: "Finance Department",
      customField2: "Management Review"
    }
  }
];

// ========================================
// MOCK AUDIT LOG DATA
// ========================================

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  userRole: string;
  details: string;
  timestamp: string;
  documentId?: string;
  documentName?: string;
  ipAddress: string;
  userAgent: string;
  severity: "low" | "medium" | "high";
}

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: "audit_001",
    action: "Document Upload",
    user: "Jane Doe",
    userRole: "Document Manager",
    details: "Uploaded new document: Q2_Contract_2024.pdf",
    timestamp: "2024-01-15T10:30:00Z",
    documentId: "doc_001",
    documentName: "Q2_Contract_2024.pdf",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "low"
  },
  {
    id: "audit_002",
    action: "Document Approval",
    user: "John Smith",
    userRole: "Super Admin",
    details: "Approved document: Q2_Contract_2024.pdf",
    timestamp: "2024-01-15T14:20:00Z",
    documentId: "doc_001",
    documentName: "Q2_Contract_2024.pdf",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    severity: "medium"
  },
  {
    id: "audit_003",
    action: "User Login",
    user: "Alice Brown",
    userRole: "Document Viewer",
    details: "User logged in successfully",
    timestamp: "2024-01-15T09:15:00Z",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "low"
  },
  {
    id: "audit_004",
    action: "Document Download",
    user: "Bob Johnson",
    userRole: "Document Editor",
    details: "Downloaded document: Employee_Handbook.pdf",
    timestamp: "2024-01-15T11:45:00Z",
    documentId: "doc_006",
    documentName: "Employee_Handbook.pdf",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36",
    severity: "low"
  },
  {
    id: "audit_005",
    action: "Document Rejection",
    user: "Charlie Wilson",
    userRole: "Document Manager",
    details: "Rejected document: Budget_Q2.xlsx - Reason: Incomplete financial data",
    timestamp: "2024-01-15T16:30:00Z",
    documentId: "doc_007",
    documentName: "Budget_Q2.xlsx",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "medium"
  },
  {
    id: "audit_006",
    action: "Role Assignment",
    user: "Admin System",
    userRole: "Super Admin",
    details: "Assigned role 'Document Editor' to user: David Lee",
    timestamp: "2024-01-15T08:00:00Z",
    ipAddress: "127.0.0.1",
    userAgent: "System Process",
    severity: "high"
  },
  {
    id: "audit_007",
    action: "Document Deletion",
    user: "Jane Doe",
    userRole: "Document Manager",
    details: "Deleted document: Old_Contract_2023.pdf",
    timestamp: "2024-01-15T17:00:00Z",
    documentId: "doc_deleted",
    documentName: "Old_Contract_2023.pdf",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "high"
  },
  {
    id: "audit_008",
    action: "Failed Login Attempt",
    user: "Unknown User",
    userRole: "N/A",
    details: "Failed login attempt with email: hacker@example.com",
    timestamp: "2024-01-15T03:30:00Z",
    ipAddress: "203.0.113.1",
    userAgent: "curl/7.68.0",
    severity: "high"
  }
];

// ========================================
// MOCK COMMENTS DATA
// ========================================

export interface Comment {
  id: string;
  documentId: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
  attachments?: string[];
  replyTo?: string;
}

export const mockComments: Comment[] = [
  {
    id: "comment_001",
    documentId: "doc_001",
    author: "John Smith",
    authorRole: "Super Admin",
    content: "This contract looks good overall, but please review section 3.2 for compliance requirements.",
    timestamp: "2024-01-15T14:00:00Z",
    isInternal: true
  },
  {
    id: "comment_002",
    documentId: "doc_001",
    author: "Jane Doe",
    authorRole: "Document Manager",
    content: "Updated section 3.2 as requested. Please review the changes.",
    timestamp: "2024-01-15T15:30:00Z",
    isInternal: true,
    replyTo: "comment_001"
  },
  {
    id: "comment_003",
    documentId: "doc_001",
    author: "Legal Team",
    authorRole: "External Reviewer",
    content: "Legal review completed. Document is compliant with current regulations.",
    timestamp: "2024-01-15T16:15:00Z",
    isInternal: false,
    attachments: ["legal_review_checklist.pdf"]
  },
  {
    id: "comment_004",
    documentId: "doc_002",
    author: "Alice Brown",
    authorRole: "Document Viewer",
    content: "The quarterly figures in table 2 seem inconsistent with previous reports.",
    timestamp: "2024-01-14T10:20:00Z",
    isInternal: true
  },
  {
    id: "comment_005",
    documentId: "doc_002",
    author: "Finance Team",
    authorRole: "Department Head",
    content: "Thank you for catching that. The figures have been corrected and updated.",
    timestamp: "2024-01-14T14:45:00Z",
    isInternal: true,
    replyTo: "comment_004"
  }
];

// ========================================
// MOCK APPROVAL HISTORY DATA
// ========================================

export interface ApprovalStep {
  id: string;
  documentId: string;
  stepNumber: number;
  approverName: string;
  approverRole: string;
  status: "pending" | "approved" | "rejected" | "skipped";
  timestamp?: string;
  comments?: string;
  isRequired: boolean;
}

export const mockApprovalHistory: ApprovalStep[] = [
  {
    id: "approval_001",
    documentId: "doc_001",
    stepNumber: 1,
    approverName: "Department Manager",
    approverRole: "Document Manager",
    status: "approved",
    timestamp: "2024-01-15T12:00:00Z",
    comments: "Content approved for departmental requirements.",
    isRequired: true
  },
  {
    id: "approval_002",
    documentId: "doc_001",
    stepNumber: 2,
    approverName: "Legal Review",
    approverRole: "Legal Team",
    status: "approved",
    timestamp: "2024-01-15T14:30:00Z",
    comments: "Legal compliance verified.",
    isRequired: true
  },
  {
    id: "approval_003",
    documentId: "doc_001",
    stepNumber: 3,
    approverName: "Executive Approval",
    approverRole: "Super Admin",
    status: "approved",
    timestamp: "2024-01-15T16:45:00Z",
    comments: "Final approval granted.",
    isRequired: true
  },
  {
    id: "approval_004",
    documentId: "doc_007",
    stepNumber: 1,
    approverName: "Finance Manager",
    approverRole: "Department Head",
    status: "rejected",
    timestamp: "2024-01-15T16:30:00Z",
    comments: "Budget figures need revision. Please provide more detailed breakdown for Q2 expenses.",
    isRequired: true
  },
  {
    id: "approval_005",
    documentId: "doc_002",
    stepNumber: 1,
    approverName: "Content Reviewer",
    approverRole: "Document Editor",
    status: "pending",
    isRequired: true
  },
  {
    id: "approval_006",
    documentId: "doc_002",
    stepNumber: 2,
    approverName: "Final Approver",
    approverRole: "Super Admin",
    status: "pending",
    isRequired: true
  }
];

// ========================================
// MOCK NOTIFICATIONS DATA
// ========================================

export interface Notification {
  id: string;
  type: "approval_request" | "document_approved" | "document_rejected" | "comment_added" | "deadline_reminder" | "system_alert";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  documentId?: string;
  priority: "low" | "medium" | "high";
  icon: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "notif_001",
    type: "approval_request",
    title: "Approval Required",
    message: "Document 'Q2_Contract_2024.pdf' requires your approval",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    actionUrl: "/documents/doc_001",
    documentId: "doc_001",
    priority: "high",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  },
  {
    id: "notif_002",
    type: "document_approved",
    title: "Document Approved",
    message: "Your document 'Employee_Handbook.pdf' has been approved",
    timestamp: "2024-01-15T14:20:00Z",
    isRead: false,
    actionUrl: "/documents/doc_006",
    documentId: "doc_006",
    priority: "medium",
    icon: "M5 13l4 4L19 7"
  },
  {
    id: "notif_003",
    type: "comment_added",
    title: "New Comment",
    message: "John Smith added a comment to 'Budget_Q2.xlsx'",
    timestamp: "2024-01-15T11:45:00Z",
    isRead: true,
    actionUrl: "/documents/doc_007",
    documentId: "doc_007",
    priority: "low",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
  },
  {
    id: "notif_004",
    type: "document_rejected",
    title: "Document Rejected",
    message: "Your document 'Budget_Q2.xlsx' has been rejected. Please review feedback.",
    timestamp: "2024-01-15T16:30:00Z",
    isRead: false,
    actionUrl: "/documents/doc_007",
    documentId: "doc_007",
    priority: "high",
    icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
  },
  {
    id: "notif_005",
    type: "deadline_reminder",
    title: "Deadline Reminder",
    message: "Document review for 'Project_Proposal.pdf' is due tomorrow",
    timestamp: "2024-01-15T08:00:00Z",
    isRead: true,
    actionUrl: "/documents/doc_004",
    documentId: "doc_004",
    priority: "medium",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  },
  {
    id: "notif_006",
    type: "system_alert",
    title: "System Maintenance",
    message: "Scheduled maintenance will begin at 2 AM tonight",
    timestamp: "2024-01-15T17:00:00Z",
    isRead: false,
    priority: "low",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  }
];

// ========================================
// MOCK PERMISSIONS DATA
// ========================================

export interface DocumentPermission {
  id: string;
  resourceId: string; // Document or Folder ID
  resourceType: "document" | "folder";
  userId?: string;
  groupId?: string;
  role: "owner" | "editor" | "viewer" | "custom";
  permissions: {
    view: boolean;
    edit: boolean;
    delete: boolean;
    share: boolean;
    download?: boolean;
    upload?: boolean;
  };
  inheritFromParent: boolean;
  grantedBy: string;
  grantedAt: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: string[]; // User IDs
}

export const mockUserGroups: UserGroup[] = [
  {
    id: "group_001",
    name: "Marketing Team",
    description: "Marketing department members",
    memberCount: 5,
    members: ["user_003", "user_004", "user_005"]
  },
  {
    id: "group_002",
    name: "Development Team",
    description: "Software development team",
    memberCount: 8,
    members: ["user_002", "user_006", "user_007"]
  },
  {
    id: "group_003",
    name: "Management",
    description: "Senior management and executives",
    memberCount: 3,
    members: ["user_001", "user_008"]
  },
  {
    id: "group_004",
    name: "Finance Team",
    description: "Finance and accounting department",
    memberCount: 4,
    members: ["user_009", "user_010"]
  }
];

export const mockDocumentPermissions: DocumentPermission[] = [
  {
    id: "perm_001",
    resourceId: "doc_001",
    resourceType: "document",
    userId: "user_001",
    role: "owner",
    permissions: {
      view: true,
      edit: true,
      delete: true,
      share: true,
      download: true
    },
    inheritFromParent: false,
    grantedBy: "system",
    grantedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "perm_002",
    resourceId: "doc_001",
    resourceType: "document",
    userId: "user_002",
    role: "editor",
    permissions: {
      view: true,
      edit: true,
      delete: false,
      share: false,
      download: true
    },
    inheritFromParent: false,
    grantedBy: "user_001",
    grantedAt: "2024-01-15T11:00:00Z"
  },
  {
    id: "perm_003",
    resourceId: "doc_001",
    resourceType: "document",
    groupId: "group_001",
    role: "viewer",
    permissions: {
      view: true,
      edit: false,
      delete: false,
      share: false,
      download: true
    },
    inheritFromParent: false,
    grantedBy: "user_001",
    grantedAt: "2024-01-15T12:00:00Z"
  },
  {
    id: "perm_004",
    resourceId: "doc_002",
    resourceType: "document",
    userId: "user_003",
    role: "editor",
    permissions: {
      view: true,
      edit: true,
      delete: false,
      share: true,
      download: true
    },
    inheritFromParent: false,
    grantedBy: "user_001",
    grantedAt: "2024-01-16T09:00:00Z"
  },
  {
    id: "perm_005",
    resourceId: "folder_001",
    resourceType: "folder",
    groupId: "group_002",
    role: "viewer",
    permissions: {
      view: true,
      edit: false,
      delete: false,
      share: false,
      upload: false
    },
    inheritFromParent: false,
    grantedBy: "user_001",
    grantedAt: "2024-01-16T10:00:00Z"
  }
];

// Role templates for quick assignment
export const roleTemplates = {
  owner: {
    view: true,
    edit: true,
    delete: true,
    share: true,
    download: true,
    upload: true
  },
  editor: {
    view: true,
    edit: true,
    delete: false,
    share: false,
    download: true,
    upload: true
  },
  viewer: {
    view: true,
    edit: false,
    delete: false,
    share: false,
    download: true,
    upload: false
  },
  custom: {
    view: false,
    edit: false,
    delete: false,
    share: false,
    download: false,
    upload: false
  }
};

// ========================================
// EXPORT ALL MOCK DATA
// ========================================

export default {
  users: mockUsers,
  roles: mockRoles,
  rolePermissions: mockRolePermissions,
  documentPermissions: mockDocumentPermissions,
  roleOptions: mockRoleOptions,
  dashboardStats: mockDashboardStats,
  recentActivity: mockRecentActivity,
  quickActions: mockQuickActions,
  documentCategories: mockDocumentCategories,
  systemStatus: mockSystemStatus,
  documents: mockDocuments,
  folders: mockFolders,
  auditLog: mockAuditLog,
  comments: mockComments,
  approvalHistory: mockApprovalHistory,
  notifications: mockNotifications,
  userGroups: mockUserGroups,
  roleTemplates: roleTemplates
};
