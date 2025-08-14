import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";
import { type Document } from "../../data";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

export default function PreviewModal({ isOpen, onClose, document }: PreviewModalProps) {
  const navigate = useNavigate();
  
  if (!document) return null;

  const handleOpenView = () => {
    navigate(`/documents/${document.id}`);
    onClose();
  };

  const getFileIcon = (extension: string) => {
    const iconMap: { [key: string]: string } = {
      pdf: "M7 18A1.5 1.5 0 005.5 16.5v-9A1.5 1.5 0 007 6h1.5a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 018.5 18H7zM14 18a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 0114 6h1.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H14z",
      docx: "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l-3.777 3.947a1 1 0 01-1.414.014L5 18V5z",
      xlsx: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z",
      pptx: "M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z",
      default: "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l-3.777 3.947a1 1 0 01-1.414.014L5 18V5z"
    };
    return iconMap[extension.toLowerCase()] || iconMap.default;
  };

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
      month: 'long', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg dark:bg-gray-800">
              <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d={getFileIcon(document.extension)} />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {document.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {document.type} • {formatFileSize(document.size)} • Version {document.version}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Document Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{document.author}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(document.date)}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Modified</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(document.lastModified)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Downloads</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{document.downloadCount} times</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <div className="flex">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  document.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  document.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  document.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {document.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {document.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {document.description && (
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{document.description}</p>
          </div>
        )}

        {/* Preview Area */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-6">
          <div className="text-center">
            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm inline-block mb-4">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d={getFileIcon(document.extension)} />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">
              Preview for {document.name}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Document preview functionality will be available in a future update.
            </p>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              <p>File Type: {document.type}</p>
              <p>Size: {formatFileSize(document.size)}</p>
              <p>Version: {document.version}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            Download
          </Button>
          <Button
            onClick={handleOpenView}
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            Open View
          </Button>
        </div>
      </div>
    </Modal>
  );
}
