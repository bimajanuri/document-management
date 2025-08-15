import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { AdvancedTable, type Column } from "../../components/ui/table";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { mockUsers, mockRoleOptions, type User } from "../../data";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "active" as "active" | "inactive"
  });

  const handleCreateUser = () => {
    setFormData({ name: "", email: "", role: "", status: "active" });
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleResetPassword = async (userId: string) => {
    // Mock API call for password reset
    const user = users.find(u => u.id === userId);
    if (user) {
      alert(`Password reset email sent to ${user.email}`);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.role) return;
    
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
      setIsEditModalOpen(false);
      setEditingUser(null);
    } else {
      // Create new user
      const newUser: User = {
        ...formData,
        id: Date.now().toString(),
        lastLogin: undefined
      };
      setUsers(prev => [...prev, newUser]);
      setIsCreateModalOpen(false);
    }
    
    setFormData({ name: "", email: "", role: "", status: "active" });
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "", status: "active" });
  };

  const getRoleLabel = (roleValue: string) => {
    const role = mockRoleOptions.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "active";
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive 
          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      }`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  // Define columns for AdvancedTable
  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value) => (
        <div className="font-medium text-gray-800 dark:text-white/90">{value}</div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      width: '25%',
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (value) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">{value}</div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      width: '15%',
      sorter: (a, b) => getRoleLabel(a.role).localeCompare(getRoleLabel(b.role)),
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          {getRoleLabel(value)}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: '12%',
      align: 'center',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      dataIndex: 'lastLogin',
      width: '15%',
      sorter: (a, b) => {
        if (!a.lastLogin && !b.lastLogin) return 0;
        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;
        return new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime();
      },
      render: (value) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {value || "Never"}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'actions',
      width: '13%',
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleEditUser(record)}
            className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
            title="Edit User"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleResetPassword(record.id)}
            className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40 rounded-lg transition-colors"
            title="Reset Password"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <PageMeta
        title="User Management | ManaDoc - Document Management System"
        description="Manage users, roles, and permissions in ManaDoc Document Management System"
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage user accounts, roles, and access permissions
          </p>
        </div>
        <Button
          onClick={handleCreateUser}
          startIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add New User
        </Button>
      </div>

      {/* Users Table */}
      <ComponentCard title="System Users" desc="Overview of all users and their current status">
        <AdvancedTable
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} users`
          }}
          scroll={{
            x: 900,
            y: 400
          }}
          size="middle"
          bordered={false}
          emptyText="No users found"
        />
      </ComponentCard>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        className="w-full max-w-lg mx-4"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Add New User
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Full Name <span className="text-error-500">*</span></Label>
              <Input
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Email Address <span className="text-error-500">*</span></Label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Role <span className="text-error-500">*</span></Label>
              <Select
                options={mockRoleOptions}
                placeholder="Select a role"
                onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                defaultValue=""
              />
            </div>
            
            <div>
              <Label>Status</Label>
              <Select
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" }
                ]}
                placeholder="Select status"
                onChange={(value) => setFormData(prev => ({ ...prev, status: value as "active" | "inactive" }))}
                defaultValue="active"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmit}>
                Create User
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

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        className="w-full max-w-lg mx-4"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Edit User: {editingUser?.name}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Full Name <span className="text-error-500">*</span></Label>
              <Input
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Email Address <span className="text-error-500">*</span></Label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Role <span className="text-error-500">*</span></Label>
              <Select
                options={mockRoleOptions}
                placeholder="Select a role"
                onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                defaultValue={formData.role}
              />
            </div>
            
            <div>
              <Label>Status</Label>
              <Select
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" }
                ]}
                placeholder="Select status"
                onChange={(value) => setFormData(prev => ({ ...prev, status: value as "active" | "inactive" }))}
                defaultValue={formData.status}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmit}>
                Update User
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
