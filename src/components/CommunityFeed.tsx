import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUserProfileStore } from '../store/userProfileStore';
import { usePostStore } from '../store/postStore';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Post as PostType } from '../types'; 
import { Edit3, Trash2 } from 'lucide-react'; // For icons

interface PostCardProps {
  post: PostType;
  currentUserUid: string | undefined;
  pincode: string; // Pincode of the group/feed
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserUid, pincode }) => {
  const { deletePost, isLoading: isDeleting } = usePostStore(state => ({
    deletePost: state.deletePost,
    isLoading: state.isLoading, // Consider a more specific loading state for delete if available
  }));
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(pincode, post.id);
        // Post deletion will be reflected by the onSnapshot listener in usePostStore
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post. See console for details.");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${post.id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {/* Header: Title, Type, and Edit/Delete buttons */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2">
        {/* Title and Type (stacked on smallest, side-by-side on sm+) */}
        <div className="mb-2 sm:mb-0">
          <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
          <p className="text-xs text-gray-500">Type: {post.type}</p>
        </div>
        {/* Edit/Delete buttons */}
        {post.authorUid === currentUserUid && (
          <div className="flex space-x-2 self-start sm:self-auto"> {/* Align buttons to start on small screens */}
            <button
              onClick={handleEdit}
              className="p-1.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-100 transition-colors"
              aria-label="Edit post"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-red-600 hover:text-red-800 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
              aria-label="Delete post"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      
      {/* Content */}
      <p className="text-gray-700 mb-2 text-sm sm:text-base">{post.content}</p>
      
      {/* Image */}
      {post.imageUrl && (
        <div className="mt-2 mb-2">
          <img src={post.imageUrl} alt="Post attachment" className="w-full max-h-60 sm:max-h-80 md:max-h-96 rounded-md object-cover"/>
        </div>
      )}

      {/* Meta: Author and Timestamps */}
      <p className="text-xs sm:text-sm text-gray-500">
        By: {post.authorName} - {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString() : 'Date unknown'}
        {post.updatedAt && post.createdAt.seconds !== post.updatedAt.seconds && (
          <span className="text-gray-400 ml-1 sm:ml-2">(Edited: {new Date(post.updatedAt.toDate()).toLocaleString()})</span>
        )}
      </p>
    </div>
  );
};

const CommunityFeed: React.FC = () => {
  const { user } = useAuthStore();
  const { userProfile, isLoading: isProfileLoading, fetchUserProfile } = useUserProfileStore();
  const { posts, isLoading: isLoadingPosts, error: postsError, fetchPosts, clearPosts } = usePostStore();

  useEffect(() => {
    // Ensure user profile is fetched if user is logged in but profile isn't loaded
    if (user && !userProfile && !isProfileLoading) {
      fetchUserProfile(user.uid);
    }
  }, [user, userProfile, isProfileLoading, fetchUserProfile]);

  useEffect(() => {
    if (user && userProfile?.location?.pincode) {
      fetchPosts(userProfile.location.pincode);
    } else if (user && userProfile && !userProfile.location?.pincode && !isProfileLoading) {
      // User logged in, profile loaded, but no pincode
      clearPosts(); // Clear any existing posts if pincode becomes unavailable
    }
    
    // Cleanup listener on component unmount or when dependencies change
    // This is handled by fetchPosts which clears the previous listener.
    // Explicitly calling clearPosts() here might be too aggressive if user navigates away and back quickly.
    // return () => {
    //  clearPosts(); // Or rely on fetchPosts to manage its own listener
    // };
  }, [user, userProfile, isProfileLoading, fetchPosts, clearPosts]); // Dependencies updated

  if (isProfileLoading) {
    return <div className="text-center py-10">Loading user profile...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Please <Link to="/" className="text-teal-500 hover:underline">sign in</Link> to view the community feed.</p>
      </div>
    );
  }

  // This check should happen after isProfileLoading is false.
  if (!userProfile) {
    // This case implies profile hasn't been created or failed to load, but not actively loading.
    // If fetchUserProfile was called, it might set an error in userProfileStore, or userProfile would become non-null.
    return (
      <div className="text-center py-10">
        <p>Loading your profile details. If this persists, please <Link to="/profile" className="text-teal-500 hover:underline">check your profile</Link>.</p>
      </div>
    );
  }
  
  if (!userProfile.location?.pincode) {
    return (
      <div className="text-center py-10">
        <p>Please <Link to="/profile" className="text-teal-500 hover:underline">complete your profile</Link> with your pincode to view the community feed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 px-2 sm:px-4"> {/* Slightly wider, adjusted padding */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Community Feed for {userProfile.location.pincode}</h1>
      
      <div className="mb-6 text-center sm:text-left"> {/* Centered on small, left on sm+ */}
        <Link 
          to="/create-post" 
          className="inline-block bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base"
        >
          Create Post
        </Link>
      </div>

      {isLoadingPosts && <p className="text-center">Loading posts...</p>}
      {postsError && <p className="text-center text-red-500">Error loading posts: {postsError}</p>}
      
      {!isLoadingPosts && posts.length === 0 && !postsError && (
        <p className="text-center text-gray-500">No posts in this community yet. Be the first to share!</p>
      )}

      <div>
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUserUid={user?.uid} 
            pincode={userProfile.location.pincode} // Pass the group's pincode
          />
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
