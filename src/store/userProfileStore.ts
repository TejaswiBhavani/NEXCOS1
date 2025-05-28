import { create } from 'zustand';
import { UserProfileData } from '../types';
import { db, auth } from '../config/firebase'; // Assuming db and auth are exported from firebase config
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

interface UserProfileState {
  userProfile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchUserProfile: (uid: string) => Promise<void>;
  createUserProfile: (uid: string, initialData: Partial<Omit<UserProfileData, 'uid' | 'createdAt' | 'updatedAt' | 'email'>> & { email: string; name: string; pincode: string }) => Promise<void>;
  updateUserProfile: (uid: string, dataToUpdate: Partial<Omit<UserProfileData, 'uid' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  userProfile: null,
  isLoading: false,
  error: null,
  
  fetchUserProfile: async (uid) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ userProfile: docSnap.data() as UserProfileData, isLoading: false });
      } else {
        // User profile not found, could be a new user or profile doesn't exist.
        // Setting userProfile to null and not necessarily an error.
        set({ userProfile: null, isLoading: false, error: 'User profile not found.' }); 
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  createUserProfile: async (uid, initialData) => {
    set({ isLoading: true, error: null });
    try {
      const newUserProfile: UserProfileData = {
        uid,
        email: initialData.email,
        name: initialData.name,
        profilePictureUrl: initialData.profilePictureUrl || '', // Default to empty string if not provided
        location: {
          pincode: initialData.pincode, // This is a required part of initialData
          city: initialData.location?.city || '', // Default to empty string
          coordinates: initialData.location?.coordinates, // Can be undefined
          manualEntry: initialData.location?.manualEntry !== undefined ? initialData.location.manualEntry : true, // Default to true
        },
        communityTags: initialData.communityTags || [], // Default to empty array
        createdAt: serverTimestamp() as Timestamp, // Firestore will replace this with a server-generated timestamp
        updatedAt: serverTimestamp() as Timestamp, // Firestore will replace this
      };
      await setDoc(doc(db, 'users', uid), newUserProfile);
      
      // Set the local state with the data sent, but ideally, re-fetch or get the written doc 
      // to have the actual server-generated timestamps. For now, optimistic update.
      // Note: serverTimestamp() locally is just a placeholder.
      set({ 
        userProfile: { ...newUserProfile, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }, // Use local Timestamp for optimistic update
        isLoading: false 
      });

      // Also update Firebase Auth display name if it's different
      if (auth.currentUser && auth.currentUser.uid === uid && auth.currentUser.displayName !== initialData.name) {
        await updateProfile(auth.currentUser, { displayName: initialData.name });
      }

    } catch (err) {
      console.error("Error creating user profile:", err);
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  updateUserProfile: async (uid, dataToUpdate) => {
    set({ isLoading: true, error: null });
    try {
      if (!auth.currentUser || auth.currentUser.uid !== uid) {
        throw new Error("User not authenticated or UID mismatch.");
      }
      
      const profileRef = doc(db, 'users', uid);
      const updatePayload = { ...dataToUpdate, updatedAt: serverTimestamp() };

      // If name is being updated, also update Firebase Auth display name
      if (dataToUpdate.name && auth.currentUser.displayName !== dataToUpdate.name) {
        await updateProfile(auth.currentUser, { displayName: dataToUpdate.name });
      }

      await updateDoc(profileRef, updatePayload);
      
      // Optimistically update local state or re-fetch.
      // For optimistic update, merge existing profile with new data.
      const currentProfile = get().userProfile;
      if (currentProfile) {
        set({ 
          userProfile: { 
            ...currentProfile, 
            ...dataToUpdate, 
            // If location is partially updated, merge it carefully
            ...(dataToUpdate.location && currentProfile.location ? 
              { location: { ...currentProfile.location, ...dataToUpdate.location } } : {}),
            updatedAt: Timestamp.now() // Use local Timestamp for optimistic update
          }, 
          isLoading: false 
        });
      } else {
        // If there's no current profile, perhaps fetch it, though update implies existence.
        await get().fetchUserProfile(uid); // Re-fetch to get the updated data
      }
    } catch (err) {
      console.error("Error updating user profile:", err);
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
