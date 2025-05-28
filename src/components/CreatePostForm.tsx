import React, { useState, useEffect } from 'react'; // Added useEffect
import { useAuthStore } from '../store/authStore';
import { useUserProfileStore } from '../store/userProfileStore';
import { usePostStore } from '../store/postStore';
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams
import { Post } from '../types';
import { db } from '../config/firebase'; // For direct DB access
import { doc, getDoc } from 'firebase/firestore'; // For direct DB access

const CreatePostForm: React.FC = () => {
  const { user } = useAuthStore();
  const { userProfile } = useUserProfileStore();
  const { createPost, updatePost, isLoading: isSubmitting, error: submissionError } = usePostStore(state => ({
    createPost: state.createPost,
    updatePost: state.updatePost,
    isLoading: state.isLoading,
    error: state.error,
  }));
  const navigate = useNavigate();
  const { postId } = useParams<{ postId?: string }>(); // Get postId from URL

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<Post['type']>('Update');
  const [editMode, setEditMode] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false); // For loading existing post data

  useEffect(() => {
    if (postId && userProfile?.location?.pincode) {
      setEditMode(true);
      setIsLoadingPost(true);
      const fetchPostData = async () => {
        try {
          const postRef = doc(db, 'groups', userProfile.location.pincode!, 'posts', postId);
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            const postData = postSnap.data() as Post;
            setTitle(postData.title);
            setContent(postData.content);
            setPostType(postData.type);
            // Ensure the fetched post's author matches the current user
            if (postData.authorUid !== user?.uid) {
                alert("You are not authorized to edit this post.");
                navigate('/feed'); // Or some other appropriate page
                return;
            }
          } else {
            alert("Post not found.");
            navigate('/feed');
          }
        } catch (error) {
          console.error("Error fetching post for edit:", error);
          alert("Failed to load post data.");
        } finally {
          setIsLoadingPost(false);
        }
      };
      fetchPostData();
    }
  }, [postId, userProfile?.location?.pincode, user?.uid, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile?.location?.pincode) {
      alert("You must be logged in and have a pincode in your profile to post.");
      return;
    }

    const postDataPayload = { title, content, type: postType };

    if (editMode && postId) {
      await updatePost(userProfile.location.pincode, postId, postDataPayload);
      // Error handling for updatePost is managed by the store and can be displayed if needed via submissionError
      if (!submissionError) navigate('/feed'); // Navigate only if no error from store
    } else {
      const newPostId = await createPost(postDataPayload, userProfile.location.pincode);
      if (newPostId) {
        navigate('/feed');
      }
      // Error handling for createPost is managed by the store
    }
  };
  
  if (isLoadingPost) {
    return <div className="text-center py-10">Loading post details...</div>;
  }

  if (!userProfile?.location?.pincode && !editMode) { // Allow edit mode even if profile is loading, post data fetch handles pincode
    return (
      <div className="text-center py-10 max-w-md mx-auto">
        <p className="mb-4">Please set your pincode in your profile before creating a post.</p>
        <button onClick={() => navigate('/profile')} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mt-6 sm:mt-10">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
        {editMode ? 'Edit Post' : 'Create New Post'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="postType" className="block text-sm font-medium text-gray-700">Post Type</label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value as Post['type'])}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="Update">Update</option>
            <option value="Need Help">Need Help</option>
            <option value="Offering Help">Offering Help</option>
          </select>
        </div>
        {submissionError && <p className="text-sm text-red-500">Error: {submissionError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
        >
          {isSubmitting ? (editMode ? 'Updating...' : 'Submitting...') : (editMode ? 'Update Post' : 'Submit Post')}
        </button>
      </form>
    </div>
  );
};

export default CreatePostForm;
