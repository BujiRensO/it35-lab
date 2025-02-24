
import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonRadio, IonRadioGroup, IonButton, IonButtons, IonBackButton } from '@ionic/react';

const Radio: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const submitSelection = () => {
    console.log('Selected Option:', selectedValue);
    // Do something with the selected value, like storing it or navigating to another page.
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
              <IonBackButton defaultHref='/it35-lab/app/home'></IonBackButton>
          </IonButtons>
          <IonTitle>Radio Buttons Example</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          
      
          <IonRadioGroup value={selectedValue} onIonChange={e => setSelectedValue(e.detail.value)}>
          <IonHeader>Favorite Fruit</IonHeader>
            <IonItem>
              <IonLabel>Mango</IonLabel>
              <IonRadio slot="start" value="option1" />
            </IonItem>
            <IonItem>
              <IonLabel>Apple</IonLabel>
              <IonRadio slot="start" value="option2" />
            </IonItem>
            <IonItem>
              <IonLabel>Tangerine</IonLabel>
              <IonRadio slot="start" value="option3" />
            </IonItem>
            <IonItem>
              <IonLabel>Watermelon</IonLabel>
              <IonRadio slot="start" value="option4" />
            </IonItem>
            <IonItem>
              <IonLabel>Banana</IonLabel>
              <IonRadio slot="start" value="option5" />
            </IonItem>
            <IonItem>
              <IonLabel>Pineapple</IonLabel>
              <IonRadio slot="start" value="option6" />
            </IonItem>
          </IonRadioGroup>
        </IonList>

        <IonButton expand="full" onClick={submitSelection}>
          Submit
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Radio;

