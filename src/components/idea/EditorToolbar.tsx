import React, { useState } from 'react';
import { Smile, Copy, Eye, Calendar, Send, Undo, Redo, MessageSquare, ChevronDown, Monitor, Smartphone, History, Image, BarChart3, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { usePostDetails } from '@/context/PostDetailsContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import AddToQueueModal from './AddToQueueModal';
import SchedulePostModal from './SchedulePostModal';
import PostNowModal from './PostNowModal';
import CreatePollModal from './CreatePollModal';
import { Poll } from '@/context/PostDetailsContext';
import { MediaFile } from './MediaUploadModal';

interface EditorToolbarProps {
  onFormat: (format: string) => void;
  onInsertEmoji: (emoji: string) => void;
  onPreview: () => void;
  onShowComments: () => void;
  onCopy: () => void;
  onSchedule: () => void;
  onPostNow: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onShowVersionHistory: () => void;
  canUndo: boolean;
  canRedo: boolean;
  viewMode: 'mobile' | 'desktop';
  onViewModeToggle: () => void;
  showCommentsPanel?: boolean;
  activeFormats?: string[];
  postContent?: string;
  onAddPoll?: (pollData: Poll) => void;
  hasPoll?: boolean;
  hasMedia?: boolean;
  onAddMedia?: () => void;
  // New props for scheduling
  postStatus?: string;
  scheduledPostAt?: import('firebase/firestore').Timestamp;
  postedAt?: import('firebase/firestore').Timestamp;
  linkedinPostUrl?: string;
  // Add clientId for queue logic
  clientId?: string;
  postId?: string;
  subClientId?: string;
  // Add media and poll data for previews
  mediaFiles?: MediaFile[];
  pollData?: Poll | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onFormat,
  onInsertEmoji,
  onPreview,
  onShowComments,
  onCopy,
  onSchedule,
  onPostNow,
  onUndo,
  onRedo,
  onShowVersionHistory,
  canUndo,
  canRedo,
  viewMode,
  onViewModeToggle,
  showCommentsPanel = false,
  activeFormats = [],
  postContent = '',
  onAddPoll,
  hasPoll = false,
  hasMedia = false,
  onAddMedia,
  postStatus,
  scheduledPostAt,
  postedAt,
  linkedinPostUrl,
  clientId,
  postId,
  subClientId,
  mediaFiles = [],
  pollData
}) => {
  const isMobile = useIsMobile();
  const { currentUser } = useAuth();
  const { publishPostNow } = usePostDetails();
  const { toast } = useToast();
  const emojis = ['😀', '😊', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💡', '🎉', '🚀', '💯', '✨', '🌟', '📈', '💼', '🎯', '💪', '🙌', '👏'];
  const [showAddToQueueModal, setShowAddToQueueModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPostNowModal, setShowPostNowModal] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);

  // Check if the post is scheduled or posted
  const isScheduled = postStatus === 'Scheduled' && scheduledPostAt && scheduledPostAt.seconds > 0;
  const isPosted = postStatus === 'Posted' && postedAt && postedAt.seconds > 0;

  // Format the scheduled date and time
  const formatScheduledDateTime = () => {
    if (!scheduledPostAt) return '';
    const date = new Date(scheduledPostAt.seconds * 1000);
    return format(date, 'MMM d, h:mm a');
  };

  // Format the posted date and time
  const formatPostedDateTime = () => {
    if (!postedAt) return '';
    const date = new Date(postedAt.seconds * 1000);
    return format(date, 'MMM d, h:mm a');
  };

  const handleAddToQueue = () => {
    setShowAddToQueueModal(true);
  };

  const handleAddToQueueConfirm = (selectedTime: string, status: string) => {
    console.log('Adding to queue:', { selectedTime, status });
  };

  const handleOpenScheduleModal = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleConfirm = (date: Date, time: string, status: string) => {
    console.log('Scheduling post:', { date, time, status });
    setShowScheduleModal(false);
  };

  const handlePostNow = () => {
    console.log('EditorToolbar handlePostNow called with props:', { clientId, postId, subClientId });
    setShowPostNowModal(true);
  };

  const handlePostNowConfirm = async (status: string) => {
    if (!currentUser?.uid || !clientId || !postId || !subClientId) {
      toast({
        title: "Error",
        description: `Missing required information to publish the post. User ID: ${currentUser?.uid || 'undefined'}, Client ID: ${clientId || 'undefined'}, Post ID: ${postId || 'undefined'}, Profile ID: ${subClientId || 'undefined'}`,
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await publishPostNow(
        currentUser.uid,
        clientId,
        postId,
        subClientId,
        postContent
      );

      if (result.success) {
        toast({
          title: "Post Published",
          description: result.linkedinPostId
            ? `Your post has been successfully published to LinkedIn. Post ID: ${result.linkedinPostId}`
            : "Your post has been successfully published to LinkedIn."
        });
        setShowPostNowModal(false);
      } else {
        toast({
          title: "Publication Failed",
          description: result.error || "An error occurred while publishing your post.",
          variant: "destructive"
        });
        // Keep the modal open for retry
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Publication Failed",
        description: "An unexpected error occurred while publishing your post.",
        variant: "destructive"
      });
      // Keep the modal open for retry
    }
  };

  const handleAddMedia = () => {
    if (onAddMedia) {
      onAddMedia();
    }
  };

  const handleAddPoll = () => {
    setShowCreatePollModal(true);
  };

  const handleCreatePoll = (pollData: Poll) => {
    if (onAddPoll) {
      onAddPoll(pollData);
    }
    setShowCreatePollModal(false);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b">
        {/* Left-Aligned Editing Zone */}
        <div className="flex items-center gap-1">
          {/* Undo/Redo Controls */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-8 w-8 p-0"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="h-8 w-8 p-0"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Emoji */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-5 gap-1">
                {emojis.map((emoji, index) => (
                  <button key={index} onClick={() => onInsertEmoji(emoji)} className="p-2 hover:bg-gray-100 rounded text-lg">
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Fixed: Add Media Button - disabled when media present */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddMedia}
                className="h-8 w-8 p-0"
                disabled={hasPoll}
              >
                <Image className={`h-4 w-4 ${hasMedia ? 'text-blue-600' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasPoll ? 'Remove poll to add media' : hasMedia ? 'Edit media' : 'Add media'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Add Poll Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddPoll}
                className="h-8 w-8 p-0"
                disabled={hasMedia}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasMedia ? 'Remove media to add poll' : 'Add poll'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Version History Control */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowVersionHistory}
                className="h-8 w-8 p-0"
              >
                <History className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Version History</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onCopy} className="h-8 w-8 p-0">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <TooltipProvider>
          {/* Right-Aligned Finalize Zone */}
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showCommentsPanel ? "default" : "outline"}
                  size="sm"
                  onClick={onShowComments}
                  className={`h-8 w-8 p-0 ${showCommentsPanel
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                    }`}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show Comments</p>
              </TooltipContent>
            </Tooltip>

            {/* View Mode Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onViewModeToggle} className="h-8 w-8 p-0">
                  {viewMode === 'desktop' ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{viewMode === 'desktop' ? 'Switch to Mobile View' : 'Switch to Desktop View'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onPreview} className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview</p>
              </TooltipContent>
            </Tooltip>

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Conditional Rendering: Posted Info, Scheduled Info, or Add to Queue */}
            {isPosted ? (
              // Show posted info (no modify options for posted content)
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">Posted at</span>
                  <span className="text-sm font-medium text-green-700">
                    {formatPostedDateTime()}
                  </span>
                </div>
                {linkedinPostUrl && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(linkedinPostUrl, '_blank')}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ) : isScheduled ? (
              // Show scheduled info with modify options
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">Scheduled for</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatScheduledDateTime()}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={handleOpenScheduleModal} className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePostNow} className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Post Now
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Show original Add to Queue with dropdown
              <div className="flex">
                <DropdownMenu>
                  <div className="flex rounded-md overflow-hidden">
                    {/* Main Action Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          onClick={handleAddToQueue}
                          className={`h-8 bg-[#4E46DD] hover:bg-[#453fca] text-primary-foreground rounded-r-none border-r border-[#372fad] flex items-center ${isMobile ? 'px-3' : 'px-3 gap-1.5'}`}
                        >
                          <Send className="h-5 w-5" />
                          {!isMobile && <span className="text-sm font-medium">Add to Queue</span>}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to Queue</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Dropdown Trigger */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            className="h-8 w-8 bg-[#4E46DD] hover:bg-[#453fca] text-primary-foreground rounded-l-none px-0 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>More Options</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={handleOpenScheduleModal} className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePostNow} className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Post Now
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </TooltipProvider>
      </div>

      <AddToQueueModal
        open={showAddToQueueModal}
        onOpenChange={setShowAddToQueueModal}
        postContent={postContent}
        onAddToQueue={handleAddToQueueConfirm}
        onOpenScheduleModal={handleOpenScheduleModal}
        clientId={clientId}
        postId={postId}
        mediaFiles={mediaFiles}
        pollData={pollData}
      />

      <SchedulePostModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        postContent={postContent}
        onSchedule={handleScheduleConfirm}
        clientId={clientId}
        postId={postId}
        mediaFiles={mediaFiles}
        pollData={pollData}
      />

      <PostNowModal
        open={showPostNowModal}
        onOpenChange={setShowPostNowModal}
        postContent={postContent}
        onPost={handlePostNowConfirm}
        clientId={clientId}
        postId={postId}
        subClientId={subClientId}
        mediaFiles={mediaFiles}
        pollData={pollData}
      />

      <CreatePollModal
        open={showCreatePollModal}
        onOpenChange={setShowCreatePollModal}
        onCreatePoll={handleCreatePoll}
      />
    </>
  );
};

export default EditorToolbar;
