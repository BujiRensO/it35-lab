import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
  IonRange,
} from '@ionic/react';
import { heartOutline, heart, play, pause } from 'ionicons/icons'; // Icons for like/unlike and play/pause

// Sample music data
const musicTracks = [
  { id: 1, title: 'OMG', artist: 'NewJeans', liked: false, duration: 180 }, // NewJeans song
  { id: 2, title: 'Song 2', artist: 'Artist 2', liked: false, duration: 200 },
  { id: 3, title: 'Song 3', artist: 'Artist 3', liked: false, duration: 220 },
];

const Music: React.FC = () => {
  const [tracks, setTracks] = useState(musicTracks);
  const [isPlaying, setIsPlaying] = useState(false); // Track playback state
  const [currentTime, setCurrentTime] = useState(0); // Track current playback time

  // Function to toggle "like" status
  const toggleLike = (id: number) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) =>
        track.id === id ? { ...track, liked: !track.liked } : track
      )
    );
  };

  // Function to toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Function to format time (e.g., 120 -> 2:00)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Function to handle range change (simulate seeking)
  const handleRangeChange = (event: CustomEvent) => {
    setCurrentTime(event.detail.value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Music</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {tracks.map((track) => (
            <IonItem key={track.id}>
              <IonAvatar slot="start">
                <img
                  src={`https://picsum.photos/80/80?random=${track.id}`}
                  alt="album cover"
                />
              </IonAvatar>
              <IonLabel>
                <h2>{track.title}</h2>
                <p>{track.artist}</p>
              </IonLabel>
              <IonButton
                fill="clear"
                onClick={() => toggleLike(track.id)}
                slot="end"
              >
                <IonIcon
                  icon={track.liked ? heart : heartOutline}
                  color={track.liked ? 'danger' : 'medium'}
                />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {/* Music Player Section */}
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h2>Range Component</h2>
          <IonRange
            value={currentTime}
            min={0}
            max={180} // Duration of the NewJeans song in seconds
            onIonChange={handleRangeChange}
            style={{ margin: '16px 0' }}
          >
            <IonLabel slot="start">{formatTime(currentTime)}</IonLabel>
            <IonLabel slot="end">{formatTime(180)}</IonLabel>
          </IonRange>
          <IonButton onClick={togglePlayPause}>
            <IonIcon icon={isPlaying ? pause : play} slot="start" />
            {isPlaying ? 'Pause' : 'Play'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Music;