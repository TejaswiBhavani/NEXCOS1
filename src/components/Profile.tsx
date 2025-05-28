import React, { useState, useCallback, useEffect } from 'react';
import { User, Settings, Bell, Shield, LogOut, Upload, Camera, Trash2, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUserProfileStore } from '../store/userProfileStore';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useAuthStore(); // Renamed from authUser to user for consistency
  const { 
    userProfile, 
    isLoading: isProfileLoading, 
    error: profileError, 
    fetchUserProfile, 
    createUserProfile, 
    updateUserProfile 
  } = useUserProfileStore();

  const [activeTab, setActiveTab] = useState('profile');
  
  // Local form state
  const [formName, setFormName] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formCommunityTagsStr, setFormCommunityTagsStr] = useState('');

  // State for profile picture preview (from existing logic)
  const [isUploading, setIsUploading] = useState(false); // Relates to react-dropzone for profile pic
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null); // For cover photo preview
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null); // For profile photo preview

  // State for submission loading/error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch user profile
  useEffect(() => {
    if (user?.uid && !userProfile) { // Check user.uid, not user.id
      fetchUserProfile(user.uid);
    }
  }, [user?.uid, fetchUserProfile, userProfile]); // Add userProfile to dependency array

  // Populate form when userProfile loads or auth user's display name changes
  useEffect(() => {
    if (userProfile) {
      setFormName(userProfile.name || '');
      setFormPincode(userProfile.location?.pincode || '');
      setFormCity(userProfile.location?.city || '');
      setFormCommunityTagsStr(userProfile.communityTags?.join(', ') || '');
      if (userProfile.profilePictureUrl) {
        setProfilePhotoPreview(userProfile.profilePictureUrl); // Set preview from stored URL
      }
    } else if (user) {
      // Pre-fill name from auth if profile doesn't exist (for initial setup)
      setFormName(user.displayName || '');
      // Reset other fields for initial setup if no profile exists
      setFormPincode('');
      setFormCity('');
      setFormCommunityTagsStr('');
      setProfilePhotoPreview(null);
    }
  }, [userProfile, user]); // user.displayName is part of user

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.uid || !user.email) {
      setSubmitError("User authentication details are missing.");
      return;
    }
    if (!formName.trim() || !formPincode.trim() || !formCommunityTagsStr.trim()) {
      setSubmitError("Name, Pincode, and Community Tags are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const tags = formCommunityTagsStr.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    if (tags.length === 0) {
      setSubmitError("Please provide at least one community tag.");
      setIsSubmitting(false);
      return;
    }

    try {
      await createUserProfile(user.uid, {
        email: user.email,
        name: formName,
        pincode: formPincode, // This is the main pincode for the location object
        location: {
          pincode: formPincode,
          city: formCity || undefined, // Set to undefined if empty, so Firestore doesn't store empty string if not provided
          manualEntry: true,
        },
        communityTags: tags,
      });
      // Profile creation successful, userProfile will be updated by the store
      // and useEffect will populate the form again, switching to "edit" mode.
      // Optionally, clear local form error:
      // setSubmitError(null); 
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.uid || !userProfile) {
      setSubmitError("User or profile data is missing.");
      return;
    }
     if (!formName.trim() || !formPincode.trim() || !formCommunityTagsStr.trim()) {
      setSubmitError("Name, Pincode, and Community Tags are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const dataToUpdate: Partial<Omit<typeof userProfile, 'uid' | 'createdAt' | 'updatedAt'>> = {};
    const newTags = formCommunityTagsStr.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    if (newTags.length === 0) {
      setSubmitError("Please provide at least one community tag.");
      setIsSubmitting(false);
      return;
    }

    if (formName !== userProfile.name) {
      dataToUpdate.name = formName;
    }
    if (formPincode !== userProfile.location.pincode || (formCity || undefined) !== (userProfile.location.city || undefined) ) {
      dataToUpdate.location = { 
        pincode: formPincode, 
        city: formCity || undefined, 
        manualEntry: true, // Assuming update is always manual entry for now
        coordinates: userProfile.location.coordinates // Preserve existing coordinates if any
      };
    }
    // Compare arrays for changes
    const tagsChanged = JSON.stringify(newTags.sort()) !== JSON.stringify(userProfile.communityTags.sort());
    if (tagsChanged) {
      dataToUpdate.communityTags = newTags;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      setSubmitError("No changes to save.");
      setIsSubmitting(false);
      return;
    }

    try {
      await updateUserProfile(user.uid, dataToUpdate);
      // Profile update successful. Local form is already up-to-date.
      // Optionally, give feedback like "Profile Saved!"
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string); // Update preview state
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Please Sign In</h2>
          <p className="text-gray-600 mt-2">You need to be signed in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 bg-gradient-to-r from-teal-600 to-emerald-600">
          {coverPhoto ? (
            <img
              src={coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition"
                onClick={() => document.getElementById('cover-upload')?.click()}
              >
                <Upload className="w-5 h-5" />
                <span>Upload Cover Photo</span>
              </button>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCoverPhoto(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="relative px-4 sm:px-6 pb-6"> {/* Adjusted horizontal padding for consistency */}
          {/* Profile Photo */}
          <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6"> {/* Adjusted top/left for new size */}
            <div
              {...getRootProps()}
              className={`relative group cursor-pointer ${
                isDragActive ? 'ring-4 ring-teal-500' : ''
              }`}
            >
              <input {...getInputProps()} />
              {/* Responsive Profile Photo Size */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
                {profilePhotoPreview ? ( 
                  <img
                    src={profilePhotoPreview}
                    alt={formName || user?.displayName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : userProfile?.profilePictureUrl ? ( 
                  <img
                    src={userProfile.profilePictureUrl}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" /> {/* Adjusted icon size */}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-full">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" /> {/* Adjusted icon size */}
              </div>
              {profilePhotoPreview && ( 
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfilePhotoPreview(null);
                  }}
                  className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> {/* Adjusted icon size */}
                </button>
              )}
            </div>
          </div>

          {/* User Info - Name from formName (if available) or userProfile or auth user, Email from auth user */}
          {/* Adjusted top padding to account for smaller profile pic on small screens */}
          <div className="pt-16 sm:pt-20"> 
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {formName || userProfile?.name || user?.displayName || 'User Profile'}
            </h1>
            {user?.email && <p className="text-base sm:text-lg text-gray-600">{user.email}</p>} {/* Slightly adjusted email font size */}
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 border-b">
            {/* Responsive Tab Navigation: allow horizontal scroll on small screens */}
            <nav className="flex -mb-px space-x-4 sm:space-x-8 overflow-x-auto">
              {['profile', 'settings', 'notifications', 'security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-3 sm:px-4 whitespace-nowrap border-b-2 text-xs sm:text-sm font-medium transition-colors ${ // Adjusted padding and font size
                    activeTab === tab
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="py-6"
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {isProfileLoading && (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                      <p className="ml-2 text-gray-600">Loading profile...</p>
                    </div>
                  )}

                  {profileError && !isProfileLoading && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
                      <p>Error loading profile: {profileError}</p>
                      {profileError === 'User profile not found.' && !userProfile && (
                        <p className="mt-1">Please complete your profile information below.</p>
                      )}
                    </div>
                  )}
                  
                  {submitError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
                      {submitError}
                    </div>
                  )}

                  {/* Render forms only if not loading and user is authenticated */}
                  {user && !isProfileLoading && (
                    <>
                      {!userProfile && profileError === 'User profile not found.' ? (
                        // Initial Profile Setup Form
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Complete Your Profile</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Welcome! Please provide a few details to get started.
                          </p>
                          <form onSubmit={handleCreateProfile} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div className="sm:col-span-2">
                              <label htmlFor="formName" className="block text-sm font-medium text-gray-700">Name</label>
                              <input
                                type="text"
                                id="formName"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                required
                              />
                            </div>
                            {/* Pincode Field */}
                            <div>
                              <label htmlFor="formPincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                              <input
                                type="text"
                                id="formPincode"
                                value={formPincode}
                                onChange={(e) => setFormPincode(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                required
                              />
                            </div>
                            {/* City Field */}
                            <div>
                              <label htmlFor="formCity" className="block text-sm font-medium text-gray-700">City (Optional)</label>
                              <input
                                type="text"
                                id="formCity"
                                value={formCity}
                                onChange={(e) => setFormCity(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              />
                            </div>
                            {/* Community Tags Field */}
                            <div className="sm:col-span-2">
                              <label htmlFor="formCommunityTags" className="block text-sm font-medium text-gray-700">Community Tags (comma-separated)</label>
                              <input
                                type="text"
                                id="formCommunityTags"
                                value={formCommunityTagsStr}
                                onChange={(e) => setFormCommunityTagsStr(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                placeholder="e.g., student, tech_park, local_market"
                                required
                              />
                            </div>
                            <div className="sm:col-span-2 flex justify-end">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                              >
                                {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                                Complete Profile
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : userProfile ? (
                        // Edit Profile Form
                        <div>
                          <h3 className="text-base sm:text-lg font-medium text-gray-900">Personal Information</h3> {/* Adjusted heading size */}
                          <form onSubmit={handleUpdateProfile} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"> {/* Adjusted gap */}
                            {/* Name Field */}
                            <div>
                              <label htmlFor="editFormName" className="block text-sm font-medium text-gray-700">Name</label>
                              <input
                                type="text"
                                id="editFormName"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base" // Adjusted text size
                                required
                              />
                            </div>
                            {/* Email Field (Read-only) */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Email</label>
                              <input
                                type="email"
                                value={userProfile.email || user?.email || ''}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base" // Adjusted text size
                                readOnly
                              />
                            </div>
                            {/* Pincode Field */}
                            <div>
                              <label htmlFor="editFormPincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                              <input
                                type="text"
                                id="editFormPincode"
                                value={formPincode}
                                onChange={(e) => setFormPincode(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base" // Adjusted text size
                                required
                              />
                            </div>
                            {/* City Field */}
                            <div>
                              <label htmlFor="editFormCity" className="block text-sm font-medium text-gray-700">City (Optional)</label>
                              <input
                                type="text"
                                id="editFormCity"
                                value={formCity}
                                onChange={(e) => setFormCity(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base" // Adjusted text size
                              />
                            </div>
                            {/* Community Tags Field */}
                            <div className="sm:col-span-2">
                              <label htmlFor="editFormCommunityTags" className="block text-sm font-medium text-gray-700">Community Tags (comma-separated)</label>
                              <input
                                type="text"
                                id="editFormCommunityTags"
                                value={formCommunityTagsStr}
                                onChange={(e) => setFormCommunityTagsStr(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base" // Adjusted text size
                                placeholder="e.g., student, tech_park, local_market"
                                required
                              />
                            </div>
                            {/* Bio field removed */}
                            <div className="sm:col-span-2 flex justify-end">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                              >
                                {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                                Save Changes
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : null }
                    </>
                  )}
                  
                  {userProfile && ( 
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Activity History</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex-shrink-0">
                          <Bell className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-900">Created a new alert</p>
                          <p className="text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                          <p className="text-sm text-gray-500">Enable dark mode for the interface</p>
                        </div>
                        <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                          <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive email updates about your activity</p>
                        </div>
                        <button className="bg-teal-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                          <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <button className="flex items-center space-x-2 text-sm text-gray-700">
                          <Shield className="h-5 w-5 text-gray-400" />
                          <span>Change Password</span>
                        </button>
                      </div>
                      <div>
                        <button 
                          onClick={logout}
                          className="flex items-center space-x-2 text-sm text-red-600"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}