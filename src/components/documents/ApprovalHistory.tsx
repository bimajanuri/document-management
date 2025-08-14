import { mockApprovalHistory } from "../../data";

interface ApprovalHistoryProps {
  documentId: string;
}

export default function ApprovalHistory({ documentId }: ApprovalHistoryProps) {
  const approvalSteps = mockApprovalHistory
    .filter(step => step.documentId === documentId)
    .sort((a, b) => a.stepNumber - b.stepNumber);

  const formatDateTime = (timestamp?: string) => {
    if (!timestamp) return "Pending";
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900/20">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "rejected":
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center dark:bg-red-900/20">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "pending":
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center dark:bg-yellow-900/20">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case "skipped":
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      skipped: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    };

    const colorClass = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getOverallStatus = () => {
    const hasRejected = approvalSteps.some(step => step.status === "rejected");
    const allApproved = approvalSteps.every(step => step.status === "approved" || !step.isRequired);
    const hasPending = approvalSteps.some(step => step.status === "pending");

    if (hasRejected) return "rejected";
    if (allApproved) return "approved";
    if (hasPending) return "pending";
    return "draft";
  };

  const getProgressPercentage = () => {
    const totalSteps = approvalSteps.filter(step => step.isRequired).length;
    const completedSteps = approvalSteps.filter(step => 
      step.isRequired && (step.status === "approved" || step.status === "rejected")
    ).length;
    
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  };

  if (approvalSteps.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400">No approval workflow configured</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">This document doesn't require approval</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
            Approval Progress
          </h4>
          {getStatusBadge(getOverallStatus())}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div
            className="bg-brand-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {getProgressPercentage()}% complete ({approvalSteps.filter(s => s.status === "approved").length} of {approvalSteps.filter(s => s.isRequired).length} required approvals)
        </p>
      </div>

      {/* Approval Steps Timeline */}
      <div className="space-y-4">
        {approvalSteps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Timeline Line */}
            {index < approvalSteps.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            )}
            
            {/* Step Content */}
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              {getStatusIcon(step.status)}
              
              {/* Step Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">
                      Step {step.stepNumber}: {step.approverName}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {step.approverRole}
                      {step.isRequired && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          Required
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(step.status)}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDateTime(step.timestamp)}
                    </p>
                  </div>
                </div>
                
                {/* Comments */}
                {step.comments && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {step.comments}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      {(() => {
        const nextPendingStep = approvalSteps.find(step => step.status === "pending");
        if (nextPendingStep) {
          return (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Next: Waiting for {nextPendingStep.approverName}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {nextPendingStep.approverRole} review required
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
}
