import { useState } from "react";
import { mockFolders, type Folder } from "../../data";
import Button from "../ui/button/Button";

interface FolderNavigationProps {
  currentFolderId: string;
  onFolderSelect: (folderId: string) => void;
  onNewFolder?: () => void;
}

export default function FolderNavigation({
  currentFolderId,
  onFolderSelect,
  onNewFolder
}: FolderNavigationProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["root"]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const getFolderIcon = (folder: Folder, isExpanded: boolean) => {
    if (folder.subfolderCount > 0) {
      return isExpanded ? (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    );
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const isExpanded = expandedFolders.includes(folder.id);
    const isSelected = currentFolderId === folder.id;
    const hasSubfolders = folder.subfolderCount > 0;
    const subfolders = mockFolders.filter(f => f.parentId === folder.id);

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
            isSelected
              ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasSubfolders ? (
            <button
              onClick={() => toggleFolder(folder.id)}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {getFolderIcon(folder, isExpanded)}
            </button>
          ) : (
            <div className="w-5 h-5 flex items-center justify-center">
              {getFolderIcon(folder, false)}
            </div>
          )}
          
          <button
            onClick={() => onFolderSelect(folder.id)}
            className="flex-1 text-left text-sm font-medium truncate"
          >
            {folder.name}
          </button>
          
          {folder.documentCount > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
              {folder.documentCount}
            </span>
          )}
        </div>
        
        {hasSubfolders && isExpanded && (
          <div>
            {subfolders.map(subfolder => renderFolder(subfolder, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = mockFolders.filter(folder => folder.parentId === null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          Folders
        </h3>
        {onNewFolder && (
          <button
            onClick={onNewFolder}
            className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-1">
        {/* Root/All Documents */}
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
            currentFolderId === "root"
              ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
          onClick={() => onFolderSelect("root")}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <span className="text-sm font-medium">Root Folder</span>
        </div>

        {/* Folder Tree */}
        {rootFolders.map(folder => renderFolder(folder))}
      </div>

      {onNewFolder && (
        <Button
          variant="outline"
          onClick={onNewFolder}
          className="w-full text-sm"
          startIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          New Folder
        </Button>
      )}
    </div>
  );
}
