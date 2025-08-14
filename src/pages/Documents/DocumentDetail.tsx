import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import CommentsSection from "../../components/documents/CommentsSection";
import ApprovalHistory from "../../components/documents/ApprovalHistory";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import UploadModal, { type UploadMetadata } from "../../components/documents/UploadModal";
import { Modal } from "../../components/ui/modal";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import { mockDocuments, mockApprovalHistory, mockFolders, type Document } from "../../data";

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "comments" | "approval" | "history">("overview");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isUploadRevisionModalOpen, setIsUploadRevisionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundDocument = mockDocuments.find(doc => doc.id === id);
      setDocument(foundDocument || null);
    }
  }, [id]);

  if (!document) {
    return (
      <>
        <PageMeta
          title="Document Not Found | ManaDoc - Document Management System"
          description="The requested document could not be found"
        />
        <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            Document Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The document you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/documents")} variant="outline">
            Back to Documents
          </Button>
        </div>
        </div>
      </>
    );
  }

  // Check if user can approve/reject (mock logic)
  const canApprove = () => {
    const pendingApproval = mockApprovalHistory.find(
      step => step.documentId === document.id && step.status === "pending"
    );
    return pendingApproval !== undefined;
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update document status
      setDocument(prev => prev ? { ...prev, status: "approved" } : null);
      setIsApproveModalOpen(false);
      
      // Show success message (you could integrate with toast here)
      alert("Document approved successfully!");
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update document status
      setDocument(prev => prev ? { ...prev, status: "rejected" } : null);
      setIsRejectModalOpen(false);
      setRejectionReason("");
      
      // Show success message
      alert("Document rejected with feedback!");
    } catch (error) {
      console.error("Rejection failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock API function for uploading revision
  const mockUploadRevisionAPI = async (files: FileList, metadata: UploadMetadata): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!document) throw new Error("No document found");
    
    const file = files[0];
    const newVersion = `v${parseFloat(document.version.substring(1)) + 0.1}`;
    
    const updatedDocument: Document = {
      ...document,
      name: file.name,
      type: file.type.split('/')[1] || document.type,
      extension: file.name.split('.').pop() || document.extension,
      size: file.size,
      version: newVersion,
      lastModified: new Date().toISOString(),
      author: metadata.author,
      tags: metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      description: metadata.description,
      metadata: {
        title: metadata.title,
        customField1: metadata.customField1,
        customField2: metadata.customField2
      }
    };
    
    return updatedDocument;
  };

  const handleUploadRevision = async (files: FileList, metadata: UploadMetadata) => {
    try {
      const updatedDocument = await mockUploadRevisionAPI(files, metadata);
      setDocument(updatedDocument);
      setIsUploadRevisionModalOpen(false);
      alert(`Revision ${updatedDocument.version} uploaded successfully!`);
    } catch (error) {
      console.error("Upload revision failed:", error);
      alert("Failed to upload revision. Please try again.");
    }
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
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

  const tabs = [
    { id: "overview", label: "Overview", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "comments", label: "Comments", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { id: "approval", label: "Approval History", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "history", label: "Version History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }
  ];

  return (
    <>
      <PageMeta
        title={`${document.name} | ManaDoc - Document Management System`}
        description={`View and manage document: ${document.name} in ManaDoc Document Management System`}
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/documents")}
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {document.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {document.type} • {formatFileSize(document.size)} • Version {document.version}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {getStatusBadge(document.status)}
          
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
            variant="outline"
            onClick={() => setIsUploadRevisionModalOpen(true)}
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            }
          >
            Upload Revision
          </Button>

          {canApprove() && (
            <>
              <Button
                onClick={() => setIsApproveModalOpen(true)}
                startIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsRejectModalOpen(true)}
                className="text-red-600 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300"
                startIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Document Preview */}
          <div className="lg:col-span-2">
            <ComponentCard title="Document Preview">
              <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Preview not available</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Click download to view the file</p>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* Metadata */}
          <div className="space-y-6">
            <ComponentCard title="Document Information">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{document.author}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(document.date)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Modified</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(document.lastModified)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Downloads</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{document.downloadCount} times</p>
                </div>

                {document.checkedOutBy && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Checked Out By</label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{document.checkedOutBy}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {document.checkedOutDate && formatDate(document.checkedOutDate)}
                    </p>
                  </div>
                )}
              </div>
            </ComponentCard>

            <ComponentCard title="Tags & Metadata">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {document.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{document.description}</p>
                  </div>
                )}

                {document.metadata && (
                  <>
                    {document.metadata.title && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{document.metadata.title}</p>
                      </div>
                    )}
                    
                    {document.metadata.customField1 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Field 1</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{document.metadata.customField1}</p>
                      </div>
                    )}
                    
                    {document.metadata.customField2 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Field 2</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{document.metadata.customField2}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ComponentCard>
          </div>
        </div>
      )}

      {activeTab === "comments" && (
        <ComponentCard title="Comments & Discussion">
          <CommentsSection documentId={document.id} />
        </ComponentCard>
      )}

      {activeTab === "approval" && (
        <ComponentCard title="Approval Workflow">
          <ApprovalHistory documentId={document.id} />
        </ComponentCard>
      )}

      {activeTab === "history" && (
        <ComponentCard title="Version History">
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">Version history coming soon</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Track document changes and revisions</p>
          </div>
        </ComponentCard>
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleApprove}
        title="Approve Document"
        message={`Are you sure you want to approve "${document.name}"? This action will move the document to the next approval step.`}
        confirmText="Approve"
        cancelText="Cancel"
        type="info"
        isLoading={isProcessing}
      />

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} className="w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Reject Document
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please provide a reason for rejecting "{document.name}". This feedback will be sent to the document owner.
          </p>

          <div className="mb-6">
            <Label>Reason for rejection <span className="text-red-500">*</span></Label>
            <TextArea
              placeholder="Explain why this document is being rejected..."
              value={rejectionReason}
              onChange={(value) => setRejectionReason(value)}
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              disabled={!rejectionReason.trim() || isProcessing}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
              startIcon={
                isProcessing ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )
              }
            >
              {isProcessing ? "Rejecting..." : "Reject Document"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason("");
              }}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Revision Modal */}
      <UploadModal
        isOpen={isUploadRevisionModalOpen}
        onClose={() => setIsUploadRevisionModalOpen(false)}
        onUpload={handleUploadRevision}
        folders={mockFolders}
        isRevision={true}
        existingDocument={document}
        title="Upload Revision"
      />
      </div>
    </>
  );
}
