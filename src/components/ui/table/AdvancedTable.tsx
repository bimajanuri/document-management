import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from './index';
import Button from '../button/Button';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  fixed?: 'left' | 'right';
}

export interface AdvancedTableProps<T = any> {
  columns: Column<T>[];
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: string[];
    showQuickJumper?: boolean;
    showTotal?: (total: number, range: [number, number]) => string;
    onChange?: (page: number, pageSize: number) => void;
  } | false;
  loading?: boolean;
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  showHeader?: boolean;
  title?: () => React.ReactNode;
  footer?: () => React.ReactNode;
  expandable?: {
    expandedRowRender?: (record: T, index: number) => React.ReactNode;
    rowExpandable?: (record: T) => boolean;
  };
  rowSelection?: {
    type?: 'checkbox' | 'radio';
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  };
  onRow?: (record: T, index?: number) => {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onDoubleClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
  };
  className?: string;
  emptyText?: string;
}

export default function AdvancedTable<T = any>({
  columns,
  dataSource,
  rowKey = 'id',
  pagination = { current: 1, pageSize: 10, showSizeChanger: true, showQuickJumper: true },
  loading = false,
  scroll,
  size = 'middle',
  bordered = false,
  showHeader = true,
  title,
  footer,
  expandable,
  rowSelection,
  onRow,
  className = '',
  emptyText = 'No data'
}: AdvancedTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [expandedRows, setExpandedRows] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(pagination ? pagination.current || 1 : 1);
  const [pageSize, setPageSize] = useState(pagination ? pagination.pageSize || 10 : 10);

  // Get row key function
  const getRowKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === 'string') {
      return (record as any)[rowKey] || index;
    }
    return rowKey(record);
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return dataSource;

    const { key, direction } = sortConfig;
    const column = columns.find(col => col.key === key);
    
    if (!column?.sorter) return dataSource;

    return [...dataSource].sort((a, b) => {
      if (typeof column.sorter === 'function') {
        const result = column.sorter(a, b);
        return direction === 'desc' ? -result : result;
      }

      const aValue = (a as any)[column.dataIndex];
      const bValue = (b as any)[column.dataIndex];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [dataSource, sortConfig, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Handle sort
  const handleSort = (column: Column<T>) => {
    if (!column.sorter) return;

    setSortConfig(current => {
      if (!current || current.key !== column.key) {
        return { key: column.key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key: column.key, direction: 'desc' };
      }
      return null;
    });
  };

  // Handle expand
  const handleExpand = (record: T) => {
    const key = getRowKey(record, 0);
    setExpandedRows(current =>
      current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key]
    );
  };

  // Handle pagination
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    if (pagination && typeof pagination === 'object' && pagination.onChange) {
      pagination.onChange(page, size);
    }
  };

  // Table size classes
  const sizeClasses = {
    small: 'text-sm',
    middle: '',
    large: 'text-base'
  };

  // Render cell content
  const renderCell = (column: Column<T>, record: T, index: number) => {
    const value = (record as any)[column.dataIndex];
    if (column.render) {
      return column.render(value, record, index);
    }
    return value;
  };

  // Render sort icon
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sorter) return null;

    const isActive = sortConfig?.key === column.key;
    const direction = sortConfig?.direction;

    return (
      <span className="ml-1 inline-flex flex-col">
        <svg 
          className={`w-3 h-3 -mb-1 ${isActive && direction === 'asc' ? 'text-brand-600' : 'text-gray-400'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
        </svg>
        <svg 
          className={`w-3 h-3 ${isActive && direction === 'desc' ? 'text-brand-600' : 'text-gray-400'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </span>
    );
  };

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    if (!pagination) return null;
    
    const total = pagination.total || sortedData.length;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    const totalPages = Math.ceil(total / pageSize);
    
    return { total, start, end, totalPages };
  }, [pagination, sortedData.length, currentPage, pageSize]);

  return (
    <div className={`advanced-table ${className}`}>
      {title && (
        <div className="mb-4">
          {title()}
        </div>
      )}

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </div>
          </div>
        )}

        <div 
          className={`overflow-auto ${scroll?.x ? 'overflow-x-auto' : ''} ${scroll?.y ? 'overflow-y-auto' : ''}`}
        >
          <Table className={`${sizeClasses[size]} ${bordered ? 'border' : ''}`}>
            {showHeader && (
              <TableHeader>
                <TableRow>
                  {rowSelection && (
                    <TableCell isHeader className="w-12">
                      {rowSelection.type !== 'radio' && (
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500 dark:bg-gray-700 dark:focus:ring-brand-400"
                          aria-label="Select all rows"
                          onChange={(e) => {
                            const allKeys = paginatedData.map((record, index) => getRowKey(record, index));
                            if (e.target.checked) {
                              rowSelection.onChange?.(allKeys, paginatedData);
                            } else {
                              rowSelection.onChange?.([], []);
                            }
                          }}
                        />
                      )}
                    </TableCell>
                  )}
                  {expandable && (
                    <TableCell isHeader className="w-12">&nbsp;</TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      isHeader
                      className={`font-medium text-gray-900 dark:text-gray-100 ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'} ${column.sorter ? 'cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
                      style={{ width: column.width }}
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center">
                        {column.title}
                        {renderSortIcon(column)}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{emptyText}</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record, index) => {
                  const key = getRowKey(record, index);
                  const isExpanded = expandedRows.includes(key);
                  const isSelected = rowSelection?.selectedRowKeys?.includes(key);
                  const rowProps = onRow?.(record, index) || {};

                  return (
                    <React.Fragment key={key}>
                      <TableRow
                        className={`${isSelected ? 'bg-brand-50 dark:bg-brand-900/20' : ''} ${rowProps.onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
                        {...rowProps}
                      >
                        {rowSelection && (
                          <TableCell>
                            <input
                              type={rowSelection.type || 'checkbox'}
                              name={rowSelection.type === 'radio' ? 'table-radio' : undefined}
                              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                              aria-label={`Select row ${index + 1}`}
                              checked={isSelected}
                              onChange={(e) => {
                                if (rowSelection.type === 'radio') {
                                  rowSelection.onChange?.([key], [record]);
                                } else {
                                  const newSelectedKeys = e.target.checked
                                    ? [...(rowSelection.selectedRowKeys || []), key]
                                    : (rowSelection.selectedRowKeys || []).filter(k => k !== key);
                                  const newSelectedRows = paginatedData.filter((r, i) => 
                                    newSelectedKeys.includes(getRowKey(r, i))
                                  );
                                  rowSelection.onChange?.(newSelectedKeys, newSelectedRows);
                                }
                              }}
                            />
                          </TableCell>
                        )}
                        {expandable && (
                          <TableCell>
                            {expandable.rowExpandable?.(record) !== false && (
                              <button
                                onClick={() => handleExpand(record)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                              >
                                <svg 
                                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                          </TableCell>
                        )}
                        {columns.map((column) => (
                          <TableCell
                            key={column.key}
                            className={column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                            style={{ width: column.width }}
                          >
                            {renderCell(column, record, index)}
                          </TableCell>
                        ))}
                      </TableRow>
                      {expandable && isExpanded && expandable.expandedRowRender && (
                        <TableRow>
                          <TableCell colSpan={(columns.length + (rowSelection ? 1 : 0) + 1)}>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                              {expandable.expandedRowRender(record, index)}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination && paginationInfo && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {paginationInfo.start} to {paginationInfo.end} of {paginationInfo.total} entries
            </span>
            {pagination.showSizeChanger && (
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageChange(1, Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  aria-label="Select page size"
                >
                  {(pagination.pageSizeOptions || ['10', '20', '50', '100']).map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span>entries</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {pagination.showQuickJumper && (
              <div className="flex items-center gap-2 mr-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Go to</span>
                <input
                  type="number"
                  min={1}
                  max={paginationInfo.totalPages}
                  className="w-16 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  aria-label="Go to page number"
                  placeholder="1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const page = Number((e.target as HTMLInputElement).value);
                      if (page >= 1 && page <= paginationInfo.totalPages) {
                        handlePageChange(page, pageSize);
                      }
                    }
                  }}
                />
                <span>page</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1, pageSize)}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
                let pageNum;
                if (paginationInfo.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= paginationInfo.totalPages - 2) {
                  pageNum = paginationInfo.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum, pageSize)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= paginationInfo.totalPages}
              onClick={() => handlePageChange(currentPage + 1, pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {footer && (
        <div className="mt-4">
          {footer()}
        </div>
      )}
    </div>
  );
}
