import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import DocumentTable from "../../components/documents/DocumentTable";
import UploadModal, { type UploadMetadata } from "../../components/documents/UploadModal";
import PreviewModal from "../../components/documents/PreviewModal";
import PermissionsModal from "../../components/documents/PermissionsModal";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import SearchBar from "../../components/shared/SearchBar";
import FilterDropdown from "../../components/shared/FilterDropdown";
import FolderNavigation from "../../components/layout/FolderNavigation";
import { NavigationProvider, useNavigation } from "../../context/NavigationContext";
import { mockDocuments, mockFolders, type Document, type DocumentPermission } from "../../data";

type ViewTab = "all" | "recent" | "favorites";

function DocumentsDashboardContent() {
  const { isNavigationOpen, toggleNavigation } = useNavigation();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [currentFolderId, setCurrentFolderId] = useState<string>("root");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ViewTab>("all");
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [documentToPreview, setDocumentToPreview] = useState<Document | null>(null);
  const [documentToShare, setDocumentToShare] = useState<Document | null>(null);


  // Get unique values for filters
  const documentTypes = Array.from(new Set(mockDocuments.map(doc => doc.type)));
  const documentStatuses = Array.from(new Set(mockDocuments.map(doc => doc.status)));

  const typeOptions = [
    { value: "", label: "All Types" },
    ...documentTypes.map(type => ({ value: type, label: type }))
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    ...documentStatuses.map(status => ({ 
      value: status, 
      label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    }))
  ];

  // Filter documents based on current filters and tab
  const filteredDocuments = documents.filter(doc => {
    // Folder filter
    const matchesFolder = currentFolderId === "root" || doc.folderId === currentFolderId;
    
    // Search filter
    const matchesSearch = searchQuery === "" || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Type filter
    const matchesType = typeFilter === "" || doc.type === typeFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "" || doc.status === statusFilter;

    // Tab filter
    let matchesTab = true;
    if (activeTab === "recent") {
      // Show documents from last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTab = new Date(doc.lastModified) > weekAgo;
    } else if (activeTab === "favorites") {
      matchesTab = doc.isFavorite;
    }

    return matchesFolder && matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  // Mock API functions
  const mockUploadAPI = async (files: FileList, metadata: UploadMetadata): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDocs: Document[] = Array.from(files).map(file => ({
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type.split('/')[1] || "Unknown",
      extension: file.name.split('.').pop() || "",
      size: file.size,
      date: new Date().toISOString().split('T')[0],
      author: metadata.author,
      version: "v1.0",
      status: "checked_in",
      tags: metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      description: metadata.description,
      folderId: metadata.folderId,
      lastModified: new Date().toISOString(),
      downloadCount: 0,
      isFavorite: false,
      metadata: {
        title: metadata.title,
        customField1: metadata.customField1,
        customField2: metadata.customField2
      }
    }));
    
    return newDocs;
  };

  const mockDownloadAPI = async (doc: Document) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Simulating download for: ${doc.name}`);
    
    // Update download count
    setDocuments(prev => prev.map(d => 
      d.id === doc.id ? { ...d, downloadCount: d.downloadCount + 1 } : d
    ));
  };

  const mockDeleteAPI = async (docId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Simulating delete for: ${docId}`);
    return { success: true };
  };

  // Event handlers
  const handleUpload = async (files: FileList, metadata: UploadMetadata) => {
    try {
      const newDocs = await mockUploadAPI(files, metadata);
      setDocuments(prev => [...prev, ...newDocs]);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDeleteConfirm = (document: Document) => {
    setDocumentToDelete(document);
    setIsConfirmationModalOpen(true);
  };

  const handleDelete = async () => {
    if (documentToDelete) {
      try {
        await mockDeleteAPI(documentToDelete.id);
        setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
        setIsConfirmationModalOpen(false);
        setDocumentToDelete(null);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };



  const handlePreview = (document: Document) => {
    setDocumentToPreview(document);
    setIsPreviewModalOpen(true);
  };

  const handleShare = (document: Document) => {
    setDocumentToShare(document);
    setIsPermissionsModalOpen(true);
  };

  const handleSavePermissions = (permissions: DocumentPermission[]) => {
    console.log("Permissions saved:", permissions);
    // In a real app, this would save to the backend
    // For now, we'll just log the permissions
    setIsPermissionsModalOpen(false);
    setDocumentToShare(null);
  };

  const handleToggleFavorite = (document: Document) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === document.id ? { ...doc, isFavorite: !doc.isFavorite } : doc
    ));
  };

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedDocuments(selected ? filteredDocuments.map(doc => doc.id) : []);
  };

  const getCurrentFolderName = () => {
    if (currentFolderId === "root") return "Root Folder";
    const folder = mockFolders.find(f => f.id === currentFolderId);
    return folder?.name || "Unknown Folder";
  };

  const getTabIcon = (tab: ViewTab) => {
    switch (tab) {
      case "all":
        return "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
      case "recent":
        return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
      case "favorites":
        return "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z";
      default:
        return "";
    }
  };

  return (
    <>
      <PageMeta
        title="Documents | ManaDoc - Document Management System"
        description="Manage, upload, and organize your documents with ManaDoc's powerful document management system"
      />
      <div className="flex gap-6">
      {/* Sidebar - Folder Navigation */}
      <div className={`flex-shrink-0 transition-all duration-300 ${isNavigationOpen ? 'w-64' : 'w-0'}`}>
        <div className={`${isNavigationOpen ? 'block' : 'hidden'}`}>
          <ComponentCard title="Navigation" className="sticky top-4">
            <FolderNavigation
              currentFolderId={currentFolderId}
              onFolderSelect={setCurrentFolderId}
              onNewFolder={() => console.log("New folder functionality coming soon")}
            />
          </ComponentCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleNavigation}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                DMS Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current folder: {getCurrentFolderName()}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            }
          >
            Upload
          </Button>
        </div>

        {/* Search and Filters */}
        <ComponentCard title="Search & Filters">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search documents..."
              label="Search Documents"
              className="md:col-span-2 xl:col-span-2"
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-2 md:col-span-2 xl:col-span-2">
              <FilterDropdown
                label="Document Type"
                value={typeFilter}
                options={typeOptions}
                onChange={setTypeFilter}
              />
              <FilterDropdown
                label="Status"
                value={statusFilter}
                options={statusOptions}
                onChange={setStatusFilter}
              />
            </div>
          </div>
        </ComponentCard>

        {/* Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["all", "recent", "favorites"] as ViewTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getTabIcon(tab)} />
                </svg>
                {tab === "all" ? "All Documents" : tab === "recent" ? "Recent" : "Favorites"}
                {tab === "favorites" && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded dark:bg-yellow-900/20 dark:text-yellow-400">
                    {documents.filter(doc => doc.isFavorite).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {selectedDocuments.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{selectedDocuments.length} selected</span>
              <Button variant="outline" size="sm">Bulk Actions</Button>
            </div>
          )}
        </div>

        {/* Drag & Drop Area (when no documents in current view) */}
        {filteredDocuments.length === 0 && searchQuery === "" && typeFilter === "" && statusFilter === "" && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">
              Drag & drop files here to upload
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              or click Upload above
            </p>
          </div>
        )}

        {/* Documents Table */}
        <ComponentCard 
          title={`${activeTab === "all" ? "All" : activeTab === "recent" ? "Recent" : "Favorite"} Documents`}
          desc={`${filteredDocuments.length} document${filteredDocuments.length !== 1 ? 's' : ''} found`}
        >
          <DocumentTable
            documents={filteredDocuments}
            onDownload={mockDownloadAPI}
            onDelete={handleDeleteConfirm}
            onPreview={handlePreview}
            onShare={handleShare}
            onToggleFavorite={handleToggleFavorite}
            onSelectDocument={handleSelectDocument}
            onSelectAll={handleSelectAll}
            selectedDocuments={selectedDocuments}
          />
        </ComponentCard>

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
          folders={mockFolders}
          isRevision={false}
          title="Upload New Document"
        />

        {/* Preview Modal */}
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          document={documentToPreview}
        />

        {/* Permissions Modal */}
        <PermissionsModal
          isOpen={isPermissionsModalOpen}
          onClose={() => {
            setIsPermissionsModalOpen(false);
            setDocumentToShare(null);
          }}
          resource={documentToShare}
          resourceType="document"
          onSave={handleSavePermissions}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${documentToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
      </div>
    </>
  );
}

export default function DocumentsDashboard() {
  return (
    <NavigationProvider>
      <DocumentsDashboardContent />
    </NavigationProvider>
  );
}