
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CommentCard from '../ui/CommentCard';
import { mockClients } from '../../types';

interface CommentsSectionProps {
  clientId: string;
}

// Mock LinkedIn posts data
const mockLinkedInPosts = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      title: 'CTO at InnovateNow',
      profileImage: undefined
    },
    content: 'Just implemented a new AI-powered solution that reduced our processing time by 60%. The key was finding the right balance between automation and human oversight. What challenges are you facing with AI implementation in your organization?',
    publishedAt: '2024-01-15T10:30:00Z',
    engagement: {
      likes: 124,
      comments: 18,
      shares: 7
    },
    url: 'https://linkedin.com/posts/example1',
    relevanceScore: 92
  },
  {
    id: '2',
    author: {
      name: 'Mike Chen',
      title: 'VP Engineering at DataFlow',
      profileImage: undefined
    },
    content: 'Enterprise software development is evolving rapidly. The companies that thrive are those that can adapt their architecture to be more modular and scalable. Thoughts on microservices vs monoliths in 2024?',
    publishedAt: '2024-01-14T14:15:00Z',
    engagement: {
      likes: 89,
      comments: 23,
      shares: 12
    },
    url: 'https://linkedin.com/posts/example2',
    relevanceScore: 78
  }
];

const CommentsSection: React.FC<CommentsSectionProps> = ({ clientId }) => {
  const client = mockClients.find(c => c.id === clientId);

  const handleRewrite = async (postId: string, guidelines?: string) => {
    console.log(`Rewriting comment for post ${postId} with guidelines:`, guidelines);
    // Here you would call your AI service to generate a new comment
  };

  const handlePost = (postId: string, comment: string) => {
    console.log(`Posting comment for post ${postId}:`, comment);
    // Here you would handle the actual posting logic
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Comment Opportunities</h2>
          <p className="text-gray-600 mt-1">
            AI-curated LinkedIn posts relevant to {client?.clientName}
          </p>
        </div>
        <Button variant="outline" className="text-blue-600">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Posts
        </Button>
      </div>

      <div className="space-y-6">
        {mockLinkedInPosts.map(post => (
          <CommentCard 
            key={post.id} 
            post={post} 
            aiGeneratedComment={`Great insights on ${post.content.slice(0, 50)}... As someone working in ${client?.industry}, I'd love to share our experience with similar implementations. We've found that...`}
            onRewrite={guidelines => handleRewrite(post.id, guidelines)}
            onPost={comment => handlePost(post.id, comment)}
          />
        ))}
      </div>

      {mockLinkedInPosts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>No relevant posts found at the moment.</p>
          <p className="text-sm mt-2">We'll continue monitoring LinkedIn for engagement opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
