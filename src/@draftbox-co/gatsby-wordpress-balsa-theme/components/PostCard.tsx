import React from 'react';
import { navigate } from 'gatsby';
import Img from 'gatsby-image';

export interface PostDescription {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  sticky: boolean;
  tags?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
  author?: {
    node: {
      name: string;
    };
  };
  featured_media?: {
    localFile?: {
      childImageSharp?: {
        fluid: any;
      };
      publicURL?: string;
    } | null;
  };
  acf?: {
    reading_time?: string;
  };
}

const PostCard: React.FC<{ post: PostDescription }> = ({ post }) => {
  const url = `/${post.slug}/`;

  // Extract first letter for fallback initial
  const firstLetter = post.title.charAt(0).toUpperCase();

  // Truncate excerpt to 30 words
  const truncatedExcerpt = post.excerpt
    .split(' ')
    .slice(0, 30)
    .join(' ') + (post.excerpt.split(' ').length > 30 ? '...' : '');

  return (
    <div
      className="post-card w-full lg:w-1/3 cursor-pointer"
      onClick={() => navigate(url)}
    >
      {/* Featured Badge for Sticky Posts */}
      {post.sticky && (
        <div className="inline-flex items-center mb-2">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium">Featured</span>
        </div>
      )}

      {/* Featured Image - with proper null checks */}
      {post.featured_media?.localFile?.childImageSharp?.fluid && (
        <Img
          fluid={post.featured_media.localFile.childImageSharp.fluid}
          className="mb-4 h-48 w-full object-cover rounded-t"
        />
      )}

      {/* Fallback to publicURL if no childImageSharp - with proper null checks */}
      {!post.featured_media?.localFile?.childImageSharp?.fluid &&
        post.featured_media?.localFile?.publicURL && (
          <img
            className="mb-4 h-48 w-full object-cover rounded-t"
            src={post.featured_media.localFile.publicURL}
            alt={post.title}
          />
        )}

      {/* Fallback to first letter if no image available */}
      {!post.featured_media?.localFile?.childImageSharp?.fluid &&
        !post.featured_media?.localFile?.publicURL && (
          <div className="mb-4 h-48 w-full flex items-center justify-center bg-gray-200 rounded-t">
            <span className="text-6xl font-bold text-gray-400">
              {firstLetter}
            </span>
          </div>
        )}

      {/* Post Content */}
      <div className="px-4 pb-4">
        {/* Date and Tags */}
        <div className="text-sm text-gray-600 mb-2">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.tags?.nodes && post.tags.nodes.length > 0 && (
            <>
              {' • '}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/tag/${post.tags!.nodes[0].slug}/`);
                }}
                className="hover:underline"
              >
                {post.tags.nodes[0].name}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>

        {/* Excerpt */}
        <div
          className="text-gray-700 mb-4"
          dangerouslySetInnerHTML={{ __html: truncatedExcerpt }}
        />

        {/* Footer: Author and Reading Time */}
        <div className="text-sm text-gray-600 flex items-center justify-between">
          <span>{post.author?.node?.name || 'Unknown Author'}</span>
          {post.acf?.reading_time && (
            <span>{post.acf.reading_time} min read</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
