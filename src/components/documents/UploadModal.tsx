import React, { useState, useRef, useCallback } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import { type Document, type Folder, type UploadProgress } from "../../data";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList, metadata: UploadMetadata) => Promise<void>;
  folders: Folder[];
  isRevision?: boolean;
  existingDocument?: Document;
  title?: string;
}

export interface UploadMetadata {
  title: string;
  description: string;
  tags: string;
  author: string;
  folderId: string;
  customField1: string;
  customField2: string;
}

export default function UploadModal({
  isOpen,
  onClose,
  onUpload,
  folders,
  isRevision = false,
  existingDocument,
  title
}: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    title: existingDocument?.metadata?.title || "",
    description: existingDocument?.description || "",
    tags: existingDocument?.tags?.join(", ") || "",
    author: existingDocument?.author || "",
    folderId: existingDocument?.folderId || "root",
    customField1: existingDocument?.metadata?.customField1 || "",
    customField2: existingDocument?.metadata?.customField2 || ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const folderOptions = folders.map(folder => ({
    value: folder.id,
    label: folder.path === "/" ? "Root Folder" : folder.path
  }));

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(e.dataTransfer.files);
      createUploadProgress(e.dataTransfer.files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(e.target.files);
      createUploadProgress(e.target.files);
    }
  };

  const createUploadProgress = (files: FileList) => {
    const progressList: UploadProgress[] = Array.from(files).map((file, index) => ({
      id: `upload_${Date.now()}_${index}`,
      fileName: file.name,
      progress: 0,
      status: "uploading"
    }));
    setUploadProgress(progressList);
  };

  const simulateUploadProgress = async (): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map(item => {
            if (item.status === "uploading" && item.progress < 100) {
              const increment = Math.random() * 30;
              const newProgress = Math.min(100, item.progress + increment);
              return {
                ...item,
                progress: newProgress,
                status: newProgress === 100 ? "completed" : "uploading"
              };
            }
            return item;
          })
        );
      }, 200);

      // Simulate completion after 3 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(prev =>
          prev.map(item => ({
            ...item,
            progress: 100,
            status: "completed"
          }))
        );
        resolve();
      }, 3000);
    });
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // Validate required fields
    if (!metadata.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload progress
      await simulateUploadProgress();
      
      // Call the actual upload function
      await onUpload(selectedFiles, metadata);
      
      // Reset form
      handleClose();
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadProgress(prev =>
        prev.map(item => ({
          ...item,
          status: "error",
          error: "Upload failed"
        }))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles(null);
    setUploadProgress([]);
    setIsUploading(false);
    setMetadata({
      title: "",
      description: "",
      tags: "",
      author: "",
      folderId: "root",
      customField1: "",
      customField2: ""
    });
    onClose();
  };

  const removeFile = (index: number) => {
    if (selectedFiles) {
      const dt = new DataTransfer();
      for (let i = 0; i < selectedFiles.length; i++) {
        if (i !== index) {
          dt.items.add(selectedFiles[i]);
        }
      }
      setSelectedFiles(dt.files);
      setUploadProgress(prev => prev.filter((_, i) => i !== index));
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "error": return "bg-red-500";
      case "paused": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Uploaded";
      case "error": return "Error";
      case "paused": return "Paused";
      default: return "Uploading...";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="w-full max-w-2xl mx-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          {title || (isRevision ? `Upload Revision - ${existingDocument?.name}` : "Upload Documents")}
        </h2>

        {/* File Upload Area */}
        <div className="mb-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif"
            />
            
            <div className="flex flex-col items-center gap-3">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Drag & drop files here or
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  Choose Files
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports multiple files
              </p>
            </div>
          </div>
        </div>

        {/* File List with Progress */}
        {uploadProgress.length > 0 && (
          <div className="mb-6 space-y-3">
            {uploadProgress.map((file, index) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">
                      {file.fileName}
                    </p>
                    <span className={`text-xs font-medium ${
                      file.status === "completed" ? "text-green-600 dark:text-green-400" :
                      file.status === "error" ? "text-red-600 dark:text-red-400" :
                      "text-blue-600 dark:text-blue-400"
                    }`}>
                      {getStatusText(file.status)}
                    </span>
                  </div>
                  {file.status === "uploading" && (
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(file.status)}`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  {file.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{file.error}</p>
                  )}
                </div>
                {!isUploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            
            {!isUploading && (
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                startIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Add More Files
              </Button>
            )}
          </div>
        )}

        {/* Metadata Form */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Title <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Enter title"
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Author</Label>
              <Input
                placeholder="Enter author"
                value={metadata.author}
                onChange={(e) => setMetadata(prev => ({ ...prev, author: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <Input
              placeholder="Add tags (comma separated)"
              value={metadata.tags}
              onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Custom Field 1</Label>
              <Input
                placeholder="Custom value"
                value={metadata.customField1}
                onChange={(e) => setMetadata(prev => ({ ...prev, customField1: e.target.value }))}
              />
            </div>
            <div>
              <Label>Custom Field 2</Label>
              <Input
                placeholder="Custom value"
                value={metadata.customField2}
                onChange={(e) => setMetadata(prev => ({ ...prev, customField2: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Select Folder</Label>
            <Select
              options={folderOptions}
              placeholder="Choose folder..."
              onChange={(value) => setMetadata(prev => ({ ...prev, folderId: value }))}
              defaultValue={metadata.folderId}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleUpload}
            disabled={!selectedFiles || selectedFiles.length === 0 || isUploading}
            className="flex-1"
            startIcon={
              isUploading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              )
            }
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
