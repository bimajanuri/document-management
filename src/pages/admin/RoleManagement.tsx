import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { AdvancedTable, type Column } from "../../components/ui/table";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Checkbox from "../../components/form/input/Checkbox";
import { mockRoles, mockRolePermissions, type Role, type RolePermission } from "../../data";

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });

  const handleCreateRole = () => {
    setFormData({ name: "", description: "", permissions: [] });
    setIsCreateModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    });
    setIsEditModalOpen(true);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(id => id !== permissionId)
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!formData.name.trim()) return;
    
    if (editingRole) {
      // Update existing role
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id 
          ? { ...role, ...formData }
          : role
      ));
      setIsEditModalOpen(false);
      setEditingRole(null);
    } else {
      // Create new role
      const newRole = {
        ...formData,
        id: Date.now().toString(),
        userCount: 0
      };
      setRoles(prev => [...prev, newRole]);
      setIsCreateModalOpen(false);
    }
    
    setFormData({ name: "", description: "", permissions: [] });
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingRole(null);
    setFormData({ name: "", description: "", permissions: [] });
  };

  // Group permissions by category
  const permissionsByCategory = mockRolePermissions.reduce((acc: Record<string, RolePermission[]>, permission: RolePermission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, RolePermission[]>);

  // Define columns for AdvancedTable
  const columns: Column<Role>[] = [
    {
      key: 'name',
      title: 'Role Name',
      dataIndex: 'name',
      width: '20%',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value) => (
        <div className="font-medium text-gray-800 dark:text-white/90">{value}</div>
      )
    },
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
      width: '30%',
      sorter: (a, b) => a.description.localeCompare(b.description),
      render: (value) => (
        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
          {value}
        </div>
      )
    },
    {
      key: 'userCount',
      title: 'Users',
      dataIndex: 'userCount',
      width: '10%',
      align: 'center',
      sorter: (a, b) => a.userCount - b.userCount,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          {value}
        </span>
      )
    },
    {
      key: 'permissions',
      title: 'Permissions',
      dataIndex: 'permissions',
      width: '25%',
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.permissions.slice(0, 3).map((permId) => {
            const permission = mockRolePermissions.find((p: RolePermission) => p.id === permId);
            return (
              <span
                key={permId}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {permission?.name}
              </span>
            );
          })}
          {record.permissions.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              +{record.permissions.length - 3} more
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'actions',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => handleEditRole(record)}
            className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
            title="Edit Role"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <PageMeta
        title="Role Management | ManaDoc - Document Management System"
        description="Manage roles and permissions for users in ManaDoc Document Management System"
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Role Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage user roles and permissions for the Document Management System
          </p>
        </div>
        <Button
          onClick={handleCreateRole}
          startIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Create New Role
        </Button>
      </div>

      {/* Roles Table */}
      <ComponentCard title="System Roles" desc="Overview of all roles and their permissions">
        <AdvancedTable
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={{
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} roles`
          }}
          scroll={{
            x: 1000,
            y: 500
          }}
          size="middle"
          bordered={false}
          emptyText="No roles found"
        />
      </ComponentCard>

      {/* Create Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        className="w-full max-w-2xl mx-4"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Create New Role
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Role Name <span className="text-error-500">*</span></Label>
              <Input
                placeholder="Enter role name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Input
                placeholder="Enter role description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div>
              <Label className="mb-3 block">Permissions</Label>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">{category}</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(permissions as RolePermission[]).map((permission: RolePermission) => (
                        <Checkbox
                          key={permission.id}
                          label={permission.name}
                          checked={formData.permissions.includes(permission.id)}
                          onChange={(checked) => handlePermissionChange(permission.id, checked)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmit}>
                Create Role
              </Button>
              <Button
                variant="outline"
                onClick={closeModals}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        className="w-full max-w-2xl mx-4"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Edit Role: {editingRole?.name}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Role Name <span className="text-error-500">*</span></Label>
              <Input
                placeholder="Enter role name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Input
                placeholder="Enter role description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div>
              <Label className="mb-3 block">Permissions</Label>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">{category}</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(permissions as RolePermission[]).map((permission: RolePermission) => (
                        <Checkbox
                          key={permission.id}
                          label={permission.name}
                          checked={formData.permissions.includes(permission.id)}
                          onChange={(checked) => handlePermissionChange(permission.id, checked)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmit}>
                Update Role
              </Button>
              <Button
                variant="outline"
                onClick={closeModals}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      </div>
    </>
  );
}
