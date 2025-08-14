import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { mockUsers, mockUserGroups, mockDocumentPermissions, roleTemplates, type User, type UserGroup, type DocumentPermission, type Document, type Folder } from "../../data";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Document | Folder | null;
  resourceType: "document" | "folder";
  onSave: (permissions: DocumentPermission[]) => void;
}

interface PermissionEntry {
  id: string;
  type: "user" | "group";
  userId?: string;
  groupId?: string;
  name: string;
  role: "owner" | "editor" | "viewer" | "custom";
  permissions: {
    view: boolean;
    edit: boolean;
    delete: boolean;
    share?: boolean;
    download?: boolean;
    upload?: boolean;
  };
  isNew?: boolean;
}

export default function PermissionsModal({
  isOpen,
  onClose,
  resource,
  resourceType,
  onSave
}: PermissionsModalProps) {
  const [permissionEntries, setPermissionEntries] = useState<PermissionEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<(User | UserGroup)[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Role options for dropdown
  const roleOptions = [
    { value: "owner", label: "Owner" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
    { value: "custom", label: "Custom" }
  ];

  // Load existing permissions when resource changes
  useEffect(() => {
    if (resource) {
      loadPermissions();
    }
  }, [resource]);

  // Search users and groups
  useEffect(() => {
    if (searchQuery.trim()) {
      const users = mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(user => ({ ...user, type: 'user' as const }));

      const groups = mockUserGroups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(group => ({ ...group, type: 'group' as const }));

      setSearchResults([...users, ...groups]);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadPermissions = () => {
    if (!resource) return;

    const existingPermissions = mockDocumentPermissions.filter(
      perm => perm.resourceId === resource.id && perm.resourceType === resourceType
    );

    const entries: PermissionEntry[] = existingPermissions.map(perm => {
      if (perm.userId) {
        const user = mockUsers.find(u => u.id === perm.userId);
        return {
          id: perm.id,
          type: "user",
          userId: perm.userId,
          name: user ? user.name : "Unknown User",
          role: perm.role,
          permissions: perm.permissions
        };
      } else if (perm.groupId) {
        const group = mockUserGroups.find(g => g.id === perm.groupId);
        return {
          id: perm.id,
          type: "group",
          groupId: perm.groupId,
          name: group ? group.name : "Unknown Group",
          role: perm.role,
          permissions: perm.permissions
        };
      }
      return null;
    }).filter(Boolean) as PermissionEntry[];

    setPermissionEntries(entries);
    setHasChanges(false);
  };

  const handleRoleChange = (entryId: string, newRole: string) => {
    setPermissionEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        const template = roleTemplates[newRole as keyof typeof roleTemplates];
        return {
          ...entry,
          role: newRole as any,
          permissions: { ...template }
        };
      }
      return entry;
    }));
    setHasChanges(true);
  };

  const handlePermissionChange = (entryId: string, permissionKey: string, value: boolean) => {
    setPermissionEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        const newPermissions = { ...entry.permissions, [permissionKey]: value };
        
        // Check if permissions match a template
        let newRole = "custom";
        for (const [roleName, template] of Object.entries(roleTemplates)) {
          if (JSON.stringify(template) === JSON.stringify(newPermissions)) {
            newRole = roleName;
            break;
          }
        }
        
        return {
          ...entry,
          role: newRole as any,
          permissions: newPermissions
        };
      }
      return entry;
    }));
    setHasChanges(true);
  };

  const handleAddUserOrGroup = (item: User | UserGroup) => {
    const isUser = 'email' in item;
    const existingEntry = permissionEntries.find(entry => 
      isUser ? entry.userId === item.id : entry.groupId === item.id
    );

    if (existingEntry) {
      alert(`${isUser ? 'User' : 'Group'} already has access to this ${resourceType}`);
      return;
    }

    const newEntry: PermissionEntry = {
      id: `temp_${Date.now()}`,
      type: isUser ? "user" : "group",
      ...(isUser ? { userId: item.id } : { groupId: item.id }),
      name: item.name,
      role: "viewer",
      permissions: { ...roleTemplates.viewer },
      isNew: true
    };

    setPermissionEntries(prev => [...prev, newEntry]);
    setSearchQuery("");
    setSearchResults([]);
    setHasChanges(true);
  };

  const handleRemoveEntry = (entryId: string) => {
    setPermissionEntries(prev => prev.filter(entry => entry.id !== entryId));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!resource) return;

    setIsLoading(true);
    try {
      // Convert entries back to DocumentPermission objects
      const permissions: DocumentPermission[] = permissionEntries.map(entry => ({
        id: entry.isNew ? `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : entry.id,
        resourceId: resource.id,
        resourceType,
        ...(entry.userId ? { userId: entry.userId } : { groupId: entry.groupId }),
        role: entry.role,
        permissions: {
          view: entry.permissions.view,
          edit: entry.permissions.edit,
          delete: entry.permissions.delete,
          share: entry.permissions.share || false,
          download: entry.permissions.download || false,
          upload: entry.permissions.upload || false
        },
        inheritFromParent: false,
        grantedBy: "current_user", // In real app, this would be the current user's ID
        grantedAt: new Date().toISOString()
      }));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(permissions);
      onClose();
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const getUserGroupIcon = (type: "user" | "group") => {
    if (type === "group") {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  };

  if (!resource) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Set Permissions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage access to "{resource.name}"
            </p>
          </div>
          <Button variant="outline" onClick={onClose} size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Permissions Table */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-4">User/Group</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-4">Permissions</div>
            <div className="col-span-1"></div>
          </div>

          {permissionEntries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-800">
              {/* User/Group */}
              <div className="col-span-4 flex items-center gap-3">
                {getUserGroupIcon(entry.type)}
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {entry.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.type === "group" ? "Group" : "User"}
                  </p>
                </div>
              </div>

              {/* Role Dropdown */}
              <div className="col-span-3">
                <Select
                  options={roleOptions}
                  onChange={(value) => handleRoleChange(entry.id, value)}
                  defaultValue={entry.role}
                />
              </div>

              {/* Permissions Checkboxes */}
              <div className="col-span-4 flex items-center gap-4">
                {["view", "edit", "delete"].map((permission) => (
                  <label key={permission} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={entry.permissions[permission as keyof typeof entry.permissions] || false}
                      onChange={(e) => handlePermissionChange(entry.id, permission, e.target.checked)}
                      className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {permission}
                    </span>
                  </label>
                ))}
              </div>

              {/* Remove Button */}
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => handleRemoveEntry(entry.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  title="Remove access"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {permissionEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p>No permissions set for this {resourceType}</p>
              <p className="text-sm">Add users or groups below to grant access</p>
            </div>
          )}
        </div>

        {/* Add User/Group */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Add user or group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAddUserOrGroup(item)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                    >
                      {getUserGroupIcon('email' in item ? 'user' : 'group')}
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {'email' in item ? item.email : `${item.memberCount} members`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              disabled={!searchQuery.trim()}
              onClick={() => {
                // This could trigger a more advanced user/group picker
                console.log("Advanced picker not implemented");
              }}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Changes Status */}
        {hasChanges && (
          <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Changes not saved yet
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            startIcon={
              isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )
            }
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
