import { useState, useEffect, useRef } from 'react';
import { 
  IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButton, IonInput, IonModal, IonFooter, IonCard, IonCardContent, 
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonAlert, IonText, 
  IonAvatar, IonCol, IonGrid, IonRow, IonIcon, IonPopover, IonLabel
} from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { pencil, trash, camera, close } from 'ionicons/icons';
import './FeedContainer.css';

// Define extended User interface with id
interface AppUser extends User {
  id: string;
}

interface Post {
  post_id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
  photo_url?: string;
}

const FeedContainer = () => {
  // State declarations
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{ 
    open: boolean; 
    event: Event | null; 
    postId: string | null 
  }>({ open: false, event: null, postId: null });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user and posts on component mount
  useEffect(() => {
    const fetchData = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        console.error('Error fetching user:', authError);
        return;
      }

      if (authData.user.email?.endsWith('@nbsc.edu.ph')) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        
        if (!userError && userData) {
          setUser({ 
            ...authData.user, 
            id: userData.user_id.toString() // Ensure id is string
          });
          setUsername(userData.username);
        }
      }

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('post_created_at', { ascending: false });
      
      if (!postsError) {
        setPosts(postsData.map(post => ({
          ...post,
          user_id: post.user_id.toString() // Ensure user_id is string
        })));
      }
    };

    fetchData();
  }, []);

  // File input handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Upload photo to Supabase storage
  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!user?.id) {
      console.error("User not authenticated for upload");
      return null;
    }
  
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `post_photos/${fileName}`;
  
      console.log(`Uploading ${file.name} as ${filePath}`);
  
      // 1. Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('post-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
  
      if (uploadError) {
        console.error("Upload failed:", uploadError);
        return null;
      }
  
      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-photos')
        .getPublicUrl(filePath);
  
      console.log("Upload successful. Public URL:", publicUrl);
      return publicUrl;
  
    } catch (error) {
      console.error("Full upload error:", error);
      return null;
    }
  };

  // Create new post
  const createPost = async () => {
    try {
      // Validate inputs
      if (!user?.id || !username) {
        alert("Please sign in to post");
        return;
      }
  
      if (!postContent && !selectedFile) {
        alert("Please add content or a photo");
        return;
      }
  
      // Handle photo upload
      let photoUrl: string | null = null;
      if (selectedFile) {
        console.log("Starting photo upload...");
        photoUrl = await uploadPhoto(selectedFile);
        
        if (!photoUrl) {
          alert("Failed to upload photo. Please try again.");
          return;
        }
      }
  
      // Create post data
      const postData = {
        user_id: user.id,
        username,
        post_content: postContent,
        avatar_url: await getUserAvatarUrl(user.id),
        photo_url: photoUrl
      };
  
      // Insert into database
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();
  
      if (error) throw error;
  
      // Update state
      setPosts(prev => [{
        ...data,
        user_id: data.user_id.toString()
      }, ...prev]);
  
      resetPostForm();
      setIsAlertOpen(true);
  
    } catch (error) {
      console.error("Post creation failed:", error);
      alert(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Delete post and associated photo
  const deletePost = async (postId: string) => {
    const postToDelete = posts.find(post => post.post_id === postId);
    if (!postToDelete) return;

    // Delete photo from storage if exists
    if (postToDelete.photo_url) {
      await deletePhotoFromStorage(postToDelete.photo_url);
    }

    await supabase.from('posts').delete().eq('post_id', postId);
    setPosts(posts.filter(post => post.post_id !== postId));
  };

  // Start editing a post
  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  // Save edited post
  const savePost = async () => {
    if (!editingPost) return;

    let photoUrl: string | undefined = editingPost.photo_url;
    let shouldDeleteOldPhoto = false;

    // Handle photo changes
    if (selectedFile) {
      // Upload new photo
      const newPhotoUrl = await uploadPhoto(selectedFile);
      if (newPhotoUrl) {
        photoUrl = newPhotoUrl;
        shouldDeleteOldPhoto = !!editingPost.photo_url;
      }
    } else if (editingPost.photo_url && fileInputRef.current?.value === '') {
      // Photo was removed
      shouldDeleteOldPhoto = true;
      photoUrl = undefined;
    }

    // Delete old photo if needed
    if (shouldDeleteOldPhoto && editingPost.photo_url) {
      await deletePhotoFromStorage(editingPost.photo_url);
    }

    const { data, error } = await supabase
      .from('posts')
      .update({ 
        post_content: postContent,
        photo_url: photoUrl,
        post_updated_at: new Date().toISOString()
      })
      .eq('post_id', editingPost.post_id)
      .select('*');

    if (!error && data?.[0]) {
      setPosts(posts.map(post => 
        post.post_id === editingPost.post_id ? {
          ...data[0],
          user_id: data[0].user_id.toString() // Ensure consistent typing
        } : post
      ));
      resetPostForm();
      setIsModalOpen(false);
    }
  };

  // Helper function to get user avatar URL
  const getUserAvatarUrl = async (userId: string): Promise<string> => {
    const { data, error } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('user_id', userId)
      .single();

    return !error && data?.user_avatar_url 
      ? data.user_avatar_url 
      : 'https://ionicframework.com/docs/img/demos/avatar.svg';
  };

  // Helper function to delete photo from storage
  const deletePhotoFromStorage = async (photoUrl: string) => {
    try {
      const urlParts = photoUrl.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('post-photos')).join('/');
      await supabase.storage.from('post-photos').remove([filePath]);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  // Reset post form
  const resetPostForm = () => {
    setPostContent('');
    setSelectedFile(null);
    setEditingPost(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Posts</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
          {user ? (
            <>
              {/* Create Post Card */}
              <IonCard className='post-card'>
                <IonCardHeader>
                  <IonCardTitle class='fontstyle1 post-title'>Create Post</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonInput 
                    value={postContent} 
                    onIonChange={e => setPostContent(e.detail.value!)} 
                    placeholder="Write a post..." 
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  {selectedFile && (
                    <div className="photo-preview-container">
                      <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Preview" 
                        className="photo-preview"
                      />
                      <IonButton 
                        fill="clear" 
                        color="danger"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        <IonIcon icon={close} />
                      </IonButton>
                    </div>
                  )}
                </IonCardContent>
                <div className="post-button-container">
                  <IonButton className="post-button" onClick={triggerFileInput}>
                    <IonIcon icon={camera} slot="start" />
                    {selectedFile ? 'Change Photo' : 'Upload Photo'}
                  </IonButton>
                  <IonButton className="post-button" onClick={createPost}>Post</IonButton>
                </div>
              </IonCard>

              {/* Posts List */}
              {posts.map(post => (
                <IonCard className='post-card2' key={post.post_id}>
                  <IonCardHeader>
                    <IonGrid>
                      <IonRow className="ion-align-items-center">
                        <IonCol size="auto">
                          <IonAvatar>
                            <img alt={post.username} src={post.avatar_url} />
                          </IonAvatar>
                        </IonCol>
                        <IonCol>
                          <IonCardTitle>{post.username}</IonCardTitle>
                          <IonCardSubtitle>
                            {new Date(post.post_created_at).toLocaleString()}
                            {post.post_created_at !== post.post_updated_at && ' (edited)'}
                          </IonCardSubtitle>
                        </IonCol>
                        {user.id === post.user_id && (
                          <IonCol size="auto">
                            <IonButton
                              fill="clear"
                              onClick={(e) => setPopoverState({ 
                                open: true, 
                                event: e.nativeEvent, 
                                postId: post.post_id 
                              })}
                            >
                              <IonIcon icon={pencil} color="secondary" />
                            </IonButton>
                          </IonCol>
                        )}
                      </IonRow>
                    </IonGrid>
                  </IonCardHeader>
                  
                  <IonCardContent>
                    <IonText>
                      <p>{post.post_content}</p>
                    </IonText>
                    {post.photo_url && (
                      <img 
                        src={post.photo_url} 
                        alt="Post" 
                        className="post-photo"
                      />
                    )}
                  </IonCardContent>

                  {/* Edit/Delete Popover */}
                  <IonPopover
                    isOpen={popoverState.open && popoverState.postId === post.post_id}
                    event={popoverState.event}
                    onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
                  >
                    <IonButton 
                      fill="clear" 
                      onClick={() => { 
                        startEditingPost(post); 
                        setPopoverState({ open: false, event: null, postId: null }); 
                      }}
                    >
                      Edit
                    </IonButton>
                    <IonButton 
                      fill="clear" 
                      color="danger" 
                      onClick={() => { 
                        deletePost(post.post_id); 
                        setPopoverState({ open: false, event: null, postId: null }); 
                      }}
                    >
                      Delete
                    </IonButton>
                  </IonPopover>
                </IonCard>
              ))}
            </>
          ) : (
            <IonLabel>Loading...</IonLabel>
          )}
        </IonContent>

        {/* Edit Post Modal */}
        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Post</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonInput 
              value={postContent} 
              onIonChange={e => setPostContent(e.detail.value!)} 
              placeholder="Edit your post..." 
            />
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="photo-preview-container">
              {editingPost?.photo_url && !selectedFile && (
                <>
                  <img 
                    src={editingPost.photo_url} 
                    alt="Current" 
                    className="photo-preview"
                  />
                  <IonButton 
                    fill="clear" 
                    color="danger"
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <IonIcon icon={close} />
                  </IonButton>
                </>
              )}
              {selectedFile && (
                <>
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="New" 
                    className="photo-preview"
                  />
                  <IonButton 
                    fill="clear" 
                    color="danger"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <IonIcon icon={close} />
                  </IonButton>
                </>
              )}
            </div>
            <IonButton 
              expand="block" 
              onClick={triggerFileInput}
              className="photo-upload-button"
            >
              <IonIcon icon={camera} slot="start" />
              {editingPost?.photo_url ? 'Change Photo' : 'Add Photo'}
            </IonButton>
          </IonContent>
          <IonFooter>
            <IonButton expand="block" onClick={savePost}>Save Changes</IonButton>
            <IonButton 
              expand="block" 
              fill="outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </IonButton>
          </IonFooter>
        </IonModal>

        {/* Success Alert */}
        <IonAlert
          isOpen={isAlertOpen}
          onDidDismiss={() => setIsAlertOpen(false)}
          header="Success"
          message="Post updated successfully!"
          buttons={['OK']}
        />
      </IonPage>
    </IonApp>
  );
};

export default FeedContainer;
