import { useState } from "react";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import { mockComments, type Comment } from "../../data";

interface CommentsSectionProps {
  documentId: string;
  onAddComment?: (content: string, isInternal: boolean) => void;
}

export default function CommentsSection({ documentId, onAddComment }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(
    mockComments.filter(comment => comment.documentId === documentId)
  );
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const comment: Comment = {
        id: `comment_${Date.now()}`,
        documentId,
        author: "Current User",
        authorRole: "Document Manager",
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
        isInternal
      };

      setComments(prev => [...prev, comment]);
      setNewComment("");
      
      // Call parent callback if provided
      if (onAddComment) {
        onAddComment(newComment.trim(), isInternal);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCommentTypeIcon = (isInternal: boolean) => {
    if (isInternal) {
      return (
        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Internal</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">External</span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to add a comment</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {getAuthorInitials(comment.author)}
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {comment.authorRole}
                      </span>
                      {getCommentTypeIcon(comment.isInternal)}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(comment.timestamp)}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {comment.content}
                  </p>

                  {/* Attachments */}
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {comment.attachments.length} attachment{comment.attachments.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {comment.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                              {attachment}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply indicator */}
                  {comment.replyTo && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Reply to previous comment
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-4">
          Add Comment
        </h4>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextArea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(value) => setNewComment(value)}
              rows={3}
            />
          </div>

          {/* Comment Type Selection */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="commentType"
                checked={isInternal}
                onChange={() => setIsInternal(true)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Internal Comment</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="commentType"
                checked={!isInternal}
                onChange={() => setIsInternal(false)}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 dark:border-gray-600 dark:focus:ring-green-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">External Comment</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              disabled={!newComment.trim() || isSubmitting}
              onClick={() => handleSubmit()}
              startIcon={
                isSubmitting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )
              }
            >
              {isSubmitting ? "Adding..." : "Add Comment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
