import { create } from 'zustand';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
// We might not need the local User type here anymore if FirebaseUser is used exclusively for auth state.
// import { User } from '../types'; 

interface AuthState {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  // login and logout are handled by onAuthStateChanged
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize state
  set({ user: null, isAuthenticated: false });

  // Set up Firebase auth state listener
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      set({ user: firebaseUser, isAuthenticated: true });
      // Optional: console.log('User is signed in:', firebaseUser.email);
    } else {
      set({ user: null, isAuthenticated: false });
      // Optional: console.log('User is signed out');
    }
  });

  // Zustand doesn't have a built-in unmount/destroy for `create`.
  // The listener will be active as long as the app runs and the store instance exists.
  // If you needed to unsubscribe, you'd typically do it in a component lifecycle,
  // but for a global store, this setup is common.

  // The initial state is set by the return statement.
  // onAuthStateChanged will update it whenever the auth state changes.
  return {
    user: auth.currentUser, // Set initial user from auth.currentUser
    isAuthenticated: !!auth.currentUser, // Set initial auth state based on currentUser
    // login and logout methods are removed as their functionality is covered by Firebase auth state changes
  };
});