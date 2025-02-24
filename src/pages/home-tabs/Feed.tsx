import React, { useState } from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';

const Feed: React.FC = () => {
  // State to manage the list of items
  const [items, setItems] = useState<string[]>([]);

  // Load initial data
  const loadData = () => {
    const newItems = [];
    for (let i = 0; i < 20; i++) {
      newItems.push(`Item ${items.length + i + 1}`);
    }
    setItems([...items, ...newItems]);
  };

  // Load more data on infinite scroll
  const onIonInfinite = (event: CustomEvent<void>) => {
    setTimeout(() => {
      loadData();
      (event.target as HTMLIonInfiniteScrollElement).complete();

     
      if (items.length >= 100) {
        (event.target as HTMLIonInfiniteScrollElement).disabled = true;
      }
    }, 1000); 
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {items.map((item, index) => (
            <IonItem key={index}>
              <IonAvatar slot="start" style={{ width: '120px', height: '120px' }}>
                <img
                  src={`https://picsum.photos/120/120?random=${index}`}
                  alt="avatar"
                  style={{ width: '100%', height: '100%' }}
                />
              </IonAvatar>
              <IonLabel>{item}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonInfiniteScroll onIonInfinite={onIonInfinite}>
          <IonInfiniteScrollContent
            loadingText="Loading more data..."
            loadingSpinner="bubbles"
          />
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default Feed;