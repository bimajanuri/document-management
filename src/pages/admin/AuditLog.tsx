import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/DatePicker";
import { AdvancedTable, type Column } from "../../components/ui/table";
import { mockAuditLog, type AuditLogEntry } from "../../data";

export default function AuditLog() {
  const [auditEntries] = useState<AuditLogEntry[]>(mockAuditLog);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    action: "",
    user: "",
    severity: ""
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique values for filter options
  const uniqueActions = Array.from(new Set(mockAuditLog.map(entry => entry.action)));
  const uniqueUsers = Array.from(new Set(mockAuditLog.map(entry => entry.user)));
  const severityOptions = [
    { value: "", label: "All Severities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const actionOptions = [
    { value: "", label: "All Actions" },
    ...uniqueActions.map(action => ({ value: action, label: action }))
  ];

  const userOptions = [
    { value: "", label: "All Users" },
    ...uniqueUsers.map(user => ({ value: user, label: user }))
  ];

  // Filter entries based on current filters and search
  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = searchQuery === "" || 
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = filters.action === "" || entry.action === filters.action;
    const matchesUser = filters.user === "" || entry.user === filters.user;
    const matchesSeverity = filters.severity === "" || entry.severity === filters.severity;

    // Date filtering
    let matchesDateRange = true;
    if (filters.dateFrom || filters.dateTo) {
      const entryDate = new Date(entry.timestamp);
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        matchesDateRange = matchesDateRange && entryDate >= fromDate;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        matchesDateRange = matchesDateRange && entryDate <= toDate;
      }
    }

    return matchesSearch && matchesAction && matchesUser && matchesSeverity && matchesDateRange;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      action: "",
      user: "",
      severity: ""
    });
    setSearchQuery("");
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };

    const colorClass = severityConfig[severity as keyof typeof severityConfig] || severityConfig.low;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const getActionIcon = (action: string) => {
    const iconMap: { [key: string]: string } = {
      "Document Upload": "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10",
      "Document Approval": "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      "Document Rejection": "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
      "Document Download": "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      "Document Deletion": "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
      "User Login": "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
      "Role Assignment": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      "Failed Login Attempt": "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    };

    return iconMap[action] || "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
  };

  // Define columns for AdvancedTable
  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'action',
      title: 'Action',
      dataIndex: 'action',
      width: '15%',
      sorter: (a, b) => a.action.localeCompare(b.action),
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getActionIcon(record.action)} />
            </svg>
          </div>
          <span className="font-medium text-gray-800 dark:text-white/90">
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'user',
      title: 'User',
      dataIndex: 'user',
      width: '12%',
      sorter: (a, b) => a.user.localeCompare(b.user),
      render: (value, record) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800 dark:text-white/90">
            {value}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {record.userRole}
          </span>
        </div>
      )
    },
    {
      key: 'details',
      title: 'Details',
      dataIndex: 'details',
      width: '25%',
      render: (value, record) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {value}
          </p>
          {record.documentName && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Document: {record.documentName}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'timestamp',
      title: 'Timestamp',
      dataIndex: 'timestamp',
      width: '15%',
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDateTime(value)}
        </span>
      )
    },
    {
      key: 'severity',
      title: 'Severity',
      dataIndex: 'severity',
      width: '10%',
      align: 'center',
      sorter: (a, b) => a.severity.localeCompare(b.severity),
      render: (value) => getSeverityBadge(value)
    },
    {
      key: 'ipAddress',
      title: 'IP Address',
      dataIndex: 'ipAddress',
      width: '13%',
      sorter: (a, b) => a.ipAddress.localeCompare(b.ipAddress),
      render: (value, record) => (
        <div className="flex flex-col">
          <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
            {value}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500 truncate max-w-32" title={record.userAgent}>
            {record.userAgent.split(' ')[0]}
          </span>
        </div>
      )
    }
  ];

  return (
    <>
      <PageMeta
        title="Audit Log | ManaDoc - Document Management System"
        description="View and monitor system activities and user actions in ManaDoc Document Management System"
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Audit Trail
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track all system activities and user actions for compliance and security monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={clearFilters}
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ComponentCard title="Filters" desc="Filter audit log entries by date, action, user, or severity">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <DatePicker
              label="Date From"
              value={filters.dateFrom}
              onChange={(date) => handleFilterChange("dateFrom", date)}
              placeholder="Select start date"
              maxDate={filters.dateTo || undefined}
            />
          </div>

          <div>
            <DatePicker
              label="Date To"
              value={filters.dateTo}
              onChange={(date) => handleFilterChange("dateTo", date)}
              placeholder="Select end date"
              minDate={filters.dateFrom || undefined}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Action
            </label>
            <Select
              options={actionOptions}
              onChange={(value) => handleFilterChange("action", value)}
              defaultValue={filters.action}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User
            </label>
            <Select
              options={userOptions}
              onChange={(value) => handleFilterChange("user", value)}
              defaultValue={filters.user}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Severity
            </label>
            <Select
              options={severityOptions}
              onChange={(value) => handleFilterChange("severity", value)}
              defaultValue={filters.severity}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Audit Log Table */}
      <ComponentCard 
        title="Audit Log Entries" 
        desc={`${filteredEntries.length} entries found`}
      >
        <AdvancedTable
          columns={columns}
          dataSource={filteredEntries}
          rowKey="id"
          pagination={{
            current: 1,
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '15', '25', '50'],
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} audit entries`
          }}
          scroll={{
            x: 1200,
            y: 600
          }}
          size="middle"
          bordered={false}
          emptyText="No audit entries found. Try adjusting your filters."
        />
      </ComponentCard>
      </div>
    </>
  );
}
