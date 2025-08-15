import { AdvancedTable, type Column } from "../ui/table";
import { type Document } from "../../data";

interface DocumentTableProps {
  documents: Document[];
  onDownload: (document: Document) => void;
  onDelete: (document: Document) => void;
  onPreview?: (document: Document) => void;
  onShare?: (document: Document) => void;
  onToggleFavorite?: (document: Document) => void;
  selectedDocuments?: string[];
  onSelectDocument?: (documentId: string) => void;
  onSelectAll?: (selected: boolean) => void;
}

export default function DocumentTable({
  documents,
  onDownload,
  onDelete,
  onPreview,
  onShare,
  onToggleFavorite,
  selectedDocuments = [],
  onSelectDocument,
  onSelectAll
}: DocumentTableProps) {
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      checked_in: { color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", text: "Checked In" },
      checked_out: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", text: "Checked Out" },
      pending_approval: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400", text: "Pending Approval" },
      approved: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400", text: "Rejected" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.checked_in;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getFileIcon = (extension: string) => {
    const iconConfig = {
      pdf: "text-red-600 dark:text-red-400",
      docx: "text-blue-600 dark:text-blue-400",
      doc: "text-blue-600 dark:text-blue-400",
      xlsx: "text-green-600 dark:text-green-400",
      xls: "text-green-600 dark:text-green-400",
      pptx: "text-orange-600 dark:text-orange-400",
      ppt: "text-orange-600 dark:text-orange-400",
      png: "text-purple-600 dark:text-purple-400",
      jpg: "text-purple-600 dark:text-purple-400",
      jpeg: "text-purple-600 dark:text-purple-400",
      txt: "text-gray-600 dark:text-gray-400"
    };

    const colorClass = iconConfig[extension.toLowerCase() as keyof typeof iconConfig] || "text-gray-600 dark:text-gray-400";

    return (
      <svg className={`w-5 h-5 ${colorClass}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      </svg>
    );
  };

  // Define columns for AdvancedTable
  const columns: Column<Document>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      width: '22%',
      sorter: (a, b) => a.name.localeCompare(b.name),
      mobilePriority: 1,
      mobileLabel: 'Document',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {getFileIcon(record.extension)}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 dark:text-white/90">
                {record.name}
              </span>
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(record)}
                  className={`transition-colors ${
                    record.isFavorite 
                      ? "text-yellow-500 hover:text-yellow-600" 
                      : "text-gray-400 hover:text-yellow-500"
                  }`}
                  title={record.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={
                      record.isFavorite 
                        ? "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                        : "M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"
                    } />
                  </svg>
                </button>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(record.size)}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      width: '8%',
      sorter: (a, b) => a.type.localeCompare(b.type),
      mobileHidden: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'date',
      title: 'Date',
      dataIndex: 'date',
      width: '10%',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      mobilePriority: 3,
      mobileLabel: 'Date',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(value)}</span>
      )
    },
    {
      key: 'author',
      title: 'Author',
      dataIndex: 'author',
      width: '10%',
      sorter: (a, b) => a.author.localeCompare(b.author),
      mobileHidden: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'tags',
      title: 'Tags',
      dataIndex: 'tags',
      width: '12%',
      mobileHidden: true,
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {value.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              +{value.length - 2}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'version',
      title: 'Version',
      dataIndex: 'version',
      width: '6%',
      align: 'center',
      sorter: (a, b) => {
        const aNum = parseFloat(a.version.substring(1));
        const bNum = parseFloat(b.version.substring(1));
        return aNum - bNum;
      },
      mobileHidden: true,
      render: (value) => (
        <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      sorter: (a, b) => a.status.localeCompare(b.status),
      mobilePriority: 2,
      mobileLabel: 'Status',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'actions',
      width: '22%',
      align: 'center',
      mobilePriority: 4,
      mobileLabel: 'Actions',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {onPreview && (
            <button
              onClick={() => onPreview(record)}
              className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
              title="Preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => onDownload(record)}
            className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-lg transition-colors"
            title="Download"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          
          {onShare && (
            <button
              onClick={() => onShare(record)}
              className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
              title="Share & Permissions"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => onDelete(record)}
            className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <AdvancedTable
      columns={columns}
      dataSource={documents}
      rowKey="id"
      pagination={{
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} documents`
      }}
      scroll={{
        x: 1100,
        y: 400
      }}
      size="middle"
      bordered={false}
      rowSelection={onSelectDocument ? {
        type: 'checkbox',
        selectedRowKeys: selectedDocuments,
        onChange: (selectedRowKeys) => {
          // Handle individual selection
          const newKeys = selectedRowKeys as string[];
          const currentKeys = selectedDocuments;
          
          // Find the difference to determine which item was clicked
          const added = newKeys.find(key => !currentKeys.includes(key));
          const removed = currentKeys.find(key => !newKeys.includes(key));
          
          if (added) {
            onSelectDocument(added);
          } else if (removed) {
            onSelectDocument(removed);
          }
        },
        onSelectAll: (selected) => {
          onSelectAll?.(selected);
        }
      } : undefined}
      emptyText="No documents found. Upload your first document to get started."
    />
  );
}