
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EditorMetricsProps {
  charCount: number;
  lineCount: number;
  showTruncation: boolean;
  cutoffLineTop: number;
}

const EditorMetrics: React.FC<EditorMetricsProps> = ({
  charCount,
  lineCount,
  showTruncation,
  cutoffLineTop
}) => {
  return (
    <>
      {/* Truncation line positioned properly as an overlay */}
      {showTruncation && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="absolute left-6 right-6 border-t-2 border-dashed border-gray-400 cursor-help pointer-events-auto"
              style={{ 
                top: `${cutoffLineTop + 1}px`, // Adjust spacing to be between 3rd and 4th line
                zIndex: 10
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>LinkedIn shows only the first 3 lines in feeds. Content below this line may be truncated with "...see more".</p>
          </TooltipContent>
        </Tooltip>
      )}
      
      {/* Character and line counter - stays grey */}
      <div className="absolute bottom-2 right-2">
        <span className="text-xs text-gray-500">
          {charCount} chars • {lineCount} {lineCount === 1 ? 'line' : 'lines'}
        </span>
      </div>
    </>
  );
};

export default EditorMetrics;
