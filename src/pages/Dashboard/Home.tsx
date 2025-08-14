import { useState, useEffect } from "react";
import { Link } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { 
  mockDashboardStats, 
  mockRecentActivity, 
  mockQuickActions 
} from "../../data";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const isAdmin = user?.role === "admin";

  const getActivityIcon = (icon: string, color: string) => {
    const colorClasses = {
      green: "bg-green-100 dark:bg-green-900/20",
      blue: "bg-blue-100 dark:bg-blue-900/20",
      yellow: "bg-yellow-100 dark:bg-yellow-900/20",
      purple: "bg-purple-100 dark:bg-purple-900/20",
      indigo: "bg-indigo-100 dark:bg-indigo-900/20"
    };

    const textColorClasses = {
      green: "text-green-600 dark:text-green-400",
      blue: "text-blue-600 dark:text-blue-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
      purple: "text-purple-600 dark:text-purple-400",
      indigo: "text-indigo-600 dark:text-indigo-400"
    };

    return (
      <div className={`p-2 rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
        <svg className={`w-4 h-4 ${textColorClasses[color as keyof typeof textColorClasses] || textColorClasses.blue}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
    );
  };

  const getQuickActionIcon = (icon: string) => {
    return (
      <svg className="w-6 h-6 text-brand-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    );
  };

  return (
    <>
      <PageMeta
        title="Dashboard | ManaDoc - Document Management System"
        description="ManaDoc Dashboard - Manage your documents, users, and system settings efficiently"
      />
      <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Welcome back, {user?.email || "User"}!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Document Management System Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {user?.role || "user"}
          </span>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ComponentCard title="Total Users" className="text-center">
          <div className="text-3xl font-bold text-brand-500">{mockDashboardStats.totalUsers}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Active accounts</p>
        </ComponentCard>
        
        <ComponentCard title="Total Documents" className="text-center">
          <div className="text-3xl font-bold text-green-500">{mockDashboardStats.totalDocuments}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Stored files</p>
        </ComponentCard>
        
        <ComponentCard title="Active Sessions" className="text-center">
          <div className="text-3xl font-bold text-orange-500">{mockDashboardStats.activeSessions}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Current users</p>
        </ComponentCard>
        
        <ComponentCard title="System Health" className="text-center">
          <div className="text-3xl font-bold text-green-500">{mockDashboardStats.systemHealth}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">All systems operational</p>
        </ComponentCard>
      </div>

      {/* Admin Management Section */}
      {isAdmin && (
                  <ComponentCard title="Administration" desc="Manage system users and roles">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Role Management Card */}
            <div className="p-6 border border-gray-200 rounded-lg dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Role Management</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage user roles and permissions</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create, edit, and manage user roles. Configure permissions for document access, user management, and system settings.
              </p>
              <Link to="/admin/roles">
                <Button className="w-full">
                  Manage Roles
                </Button>
              </Link>
            </div>

                                    {/* User Management Card */}
                        <div className="p-6 border border-gray-200 rounded-lg dark:border-gray-700">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/20">
                              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">User Management</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Manage user accounts and access</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Add new users, modify existing accounts, assign roles, and manage user status. Reset passwords and monitor user activity.
                          </p>
                          <Link to="/admin/users">
                            <Button className="w-full">
                              Manage Users
                            </Button>
                          </Link>
                        </div>

                        {/* Audit Log Card */}
                        <div className="p-6 border border-gray-200 rounded-lg dark:border-gray-700">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Audit Trail</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Track system activities</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Monitor all user activities, document changes, and system events for compliance and security auditing.
                          </p>
                          <Link to="/admin/audit-log">
                            <Button className="w-full">
                              View Audit Log
                            </Button>
                          </Link>
                        </div>
          </div>
        </ComponentCard>
      )}

      {/* Quick Actions */}
      <ComponentCard title="Quick Actions" desc="Common tasks and shortcuts">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/documents">
            <Button variant="outline" className="h-auto p-4 flex-col items-start w-full">
              <svg className="w-6 h-6 text-brand-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">Document Management</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Upload, view, and manage documents</span>
            </Button>
          </Link>
          {mockQuickActions.slice(0, 2).map((action) => (
            <Button key={action.id} variant="outline" className="h-auto p-4 flex-col items-start">
              {getQuickActionIcon(action.icon)}
              <span className="font-medium">{action.title}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{action.description}</span>
            </Button>
          ))}
        </div>
      </ComponentCard>

      {/* Recent Activity */}
      <ComponentCard title="Recent Activity" desc="Latest system events and updates">
        <div className="space-y-4">
          {mockRecentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
              {getActivityIcon(activity.icon, activity.color)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{activity.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </ComponentCard>
      </div>
    </>
  );
}
