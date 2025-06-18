import React, { useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, Smile, Copy, Eye, Calendar, Send, Undo, Redo, MessageSquare, ChevronDown, Plus, Monitor, Smartphone, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import AddToQueueModal from './AddToQueueModal';
import SchedulePostModal from './SchedulePostModal';
import PostNowModal from './PostNowModal';
import MediaPollSelector from './MediaPollSelector';
import CreatePollModal, { PollData } from './CreatePollModal';

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
  onAddPoll?: (pollData: PollData) => void;
  hasPoll?: boolean;
  hasMedia?: boolean;
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
  hasMedia = false
}) => {
  const isMobile = useIsMobile();
  const emojis = ['😀', '😊', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💡', '🎉', '🚀', '💯', '✨', '🌟', '📈', '💼', '🎯', '💪', '🙌', '👏'];
  const [showAddToQueueModal, setShowAddToQueueModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPostNowModal, setShowPostNowModal] = useState(false);
  const [showMediaPollSelector, setShowMediaPollSelector] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);

  const isFormatActive = (format: string) => activeFormats.includes(format);

  const handleAddToQueue = () => {
    setShowAddToQueueModal(true);
  };

  const handleAddToQueueConfirm = (selectedTime: string, status: string) => {
    console.log('Adding to queue:', { selectedTime, status });
    // Here you would typically update the post status and add to queue
  };

  const handleOpenScheduleModal = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleConfirm = (date: Date, time: string, status: string) => {
    console.log('Scheduling post:', { date, time, status });
    setShowScheduleModal(false);
    // Here you would typically handle the scheduling logic
  };

  const handlePostNow = () => {
    setShowPostNowModal(true);
  };

  const handlePostNowConfirm = (status: string) => {
    console.log('Posting now with status:', status);
    setShowPostNowModal(false);
    // Here you would typically handle the posting logic
  };

  const handlePlusClick = () => {
    setShowMediaPollSelector(true);
  };

  const handleSelectMedia = () => {
    setShowMediaPollSelector(false);
    // Trigger media upload modal from parent
    console.log('Media selected - parent will handle');
  };

  const handleSelectPoll = () => {
    setShowMediaPollSelector(false);
    setShowCreatePollModal(true);
  };

  const handleCreatePoll = (pollData: PollData) => {
    if (onAddPoll) {
      onAddPoll(pollData);
    }
    setShowCreatePollModal(false);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b">
        {/* Text Editor Toolbar */}
        <div className="flex items-center gap-1">
          <Button 
            variant={isFormatActive('bold') ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => onFormat('bold')} 
            className={`h-8 w-8 p-0 ${isFormatActive('bold') ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : ''}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant={isFormatActive('italic') ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => onFormat('italic')} 
            className={`h-8 w-8 p-0 ${isFormatActive('italic') ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : ''}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant={isFormatActive('underline') ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => onFormat('underline')} 
            className={`h-8 w-8 p-0 ${isFormatActive('underline') ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : ''}`}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button 
            variant={isFormatActive('strikeThrough') ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => onFormat('strikeThrough')} 
            className={`h-8 w-8 p-0 ${isFormatActive('strikeThrough') ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : ''}`}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
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

          {/* Plus Button for Media/Poll */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePlusClick}
                className="h-8 w-8 p-0"
                disabled={hasPoll || hasMedia}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add media or poll</p>
            </TooltipContent>
          </Tooltip>
          
          {/* View Mode Toggle Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onViewModeToggle} className="h-8 w-8 p-0">
                {viewMode === 'desktop' ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{viewMode === 'desktop' ? 'Switch to Mobile View' : 'Switch to Desktop View'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <TooltipProvider>
          <div className="flex gap-2">
            {/* Version History Control */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
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
                <Button variant="outline" size="sm" onClick={onCopy} className="h-8 w-8 p-0">
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={showCommentsPanel ? "default" : "outline"} 
                  size="sm" 
                  onClick={onShowComments} 
                  className={`h-8 w-8 p-0 ${
                    showCommentsPanel 
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
            
            {/* Add to Queue with Dropdown - Primary Styled Split Button */}
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
          </div>
        </TooltipProvider>
      </div>

      <AddToQueueModal
        open={showAddToQueueModal}
        onOpenChange={setShowAddToQueueModal}
        postContent={postContent}
        onAddToQueue={handleAddToQueueConfirm}
        onOpenScheduleModal={handleOpenScheduleModal}
      />

      <SchedulePostModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        postContent={postContent}
        onSchedule={handleScheduleConfirm}
      />

      <PostNowModal
        open={showPostNowModal}
        onOpenChange={setShowPostNowModal}
        postContent={postContent}
        onPost={handlePostNowConfirm}
      />

      <MediaPollSelector
        open={showMediaPollSelector}
        onOpenChange={setShowMediaPollSelector}
        onSelectMedia={handleSelectMedia}
        onSelectPoll={handleSelectPoll}
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
