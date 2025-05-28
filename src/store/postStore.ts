import { create } from 'zustand';
import { Post } from '../types';
import { db, auth } from '../config/firebase';
import { 
  collection, query, orderBy, onSnapshot, Timestamp, QuerySnapshot, DocumentData, 
  addDoc, serverTimestamp, doc, updateDoc, deleteDoc 
} from 'firebase/firestore'; // Added doc, updateDoc, deleteDoc

interface PostStoreState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  currentGroupPincode: string | null;
  unsubscribePostsListener: (() => void) | null;
  fetchPosts: (pincode: string) => void;
  clearPosts: () => void;
  createPost: (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorUid' | 'authorName' | 'pincode'>, currentPincode: string) => Promise<string | null>;
  updatePost: (pincode: string, postId: string, dataToUpdate: Partial<Omit<Post, 'id' | 'authorUid' | 'authorName' | 'pincode' | 'createdAt'>>) => Promise<void>;
  deletePost: (pincode: string, postId: string) => Promise<void>;
}

export const usePostStore = create<PostStoreState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  currentGroupPincode: null,
  unsubscribePostsListener: null,

  fetchPosts: (pincode) => {
    const currentUnsubscribe = get().unsubscribePostsListener;
    if (currentUnsubscribe) {
      currentUnsubscribe(); // Unsubscribe from previous listener
    }
    if (!pincode) {
      set({ posts: [], isLoading: false, error: "Pincode is required to fetch posts.", currentGroupPincode: null, unsubscribePostsListener: null });
      return;
    }

    set({ isLoading: true, error: null, currentGroupPincode: pincode });
    // Construct the path to the subcollection
    // Assuming 'groups' is a top-level collection, and each group (identified by pincode)
    // has a 'posts' subcollection.
    const postsCollectionRef = collection(db, 'groups', pincode, 'posts');
    const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Post)); // Using the concise mapping
        set({ posts: fetchedPosts, isLoading: false });
      },
      (err) => {
        console.error("Error fetching posts:", err);
        set({ error: (err as Error).message, isLoading: false, posts: [] });
      }
    );
    set({ unsubscribePostsListener: unsubscribe });
  },

  clearPosts: () => {
    const currentUnsubscribe = get().unsubscribePostsListener;
    if (currentUnsubscribe) {
      currentUnsubscribe();
    }
    // Also clear currentGroupPincode when clearing posts, and reset loading/error.
    set({ posts: [], currentGroupPincode: null, isLoading: false, error: null, unsubscribePostsListener: null });
  },

  createPost: async (postData, currentPincode) => {
    if (!auth.currentUser) {
      set({ error: "User not authenticated." });
      console.error("User not authenticated for creating post.");
      return null;
    }
    if (!currentPincode) {
      set({ error: "Pincode not available for creating post." });
      console.error("Pincode not available for creating post.");
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const newPostData = {
        ...postData,
        authorUid: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Anonymous", // Fallback for displayName
        pincode: currentPincode,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp, // Also set on creation, can be same as createdAt
        // imageUrl will be handled later if added
      };

      const postsCollectionRef = collection(db, 'groups', currentPincode, 'posts');
      const docRef = await addDoc(postsCollectionRef, newPostData);
      set({ isLoading: false });
      // No need to add to local 'posts' state if using onSnapshot, it will update automatically.
      return docRef.id;
    } catch (err) {
      console.error("Error creating post:", err);
      set({ error: (err as Error).message, isLoading: false });
      return null;
    }
  },

  updatePost: async (pincode, postId, dataToUpdate) => {
    if (!auth.currentUser) {
      set({ error: "User not authenticated." });
      console.error("User not authenticated for updating post.");
      throw new Error("User not authenticated.");
    }
    if (!pincode || !postId) {
      set({ error: "Pincode or Post ID missing for updating post." });
      console.error("Pincode or Post ID missing for updating post.");
      throw new Error("Pincode or Post ID missing.");
    }

    set({ isLoading: true, error: null });
    try {
      const postRef = doc(db, 'groups', pincode, 'posts', postId);
      const updatePayload = {
        ...dataToUpdate,
        updatedAt: serverTimestamp() as Timestamp,
      };
      await updateDoc(postRef, updatePayload);
      set({ isLoading: false });
      // Local state will be updated by onSnapshot listener
    } catch (err) {
      console.error("Error updating post:", err);
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  deletePost: async (pincode, postId) => {
    if (!auth.currentUser) {
      set({ error: "User not authenticated." });
      console.error("User not authenticated for deleting post.");
      throw new Error("User not authenticated.");
    }
    if (!pincode || !postId) {
      set({ error: "Pincode or Post ID missing for deleting post." });
      console.error("Pincode or Post ID missing for deleting post.");
      throw new Error("Pincode or Post ID missing.");
    }

    set({ isLoading: true, error: null });
    try {
      const postRef = doc(db, 'groups', pincode, 'posts', postId);
      await deleteDoc(postRef);
      set({ isLoading: false });
      // Local state will be updated by onSnapshot listener
      // Or, could manually remove from local state:
      // set(state => ({ posts: state.posts.filter(p => p.id !== postId) }));
    } catch (err) {
      console.error("Error deleting post:", err);
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },
}));
