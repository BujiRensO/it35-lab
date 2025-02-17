
import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonRadio, IonRadioGroup, IonButton } from '@ionic/react';

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
          <IonTitle>Radio Buttons Example</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonRadioGroup value={selectedValue} onIonChange={e => setSelectedValue(e.detail.value)}>
            <IonItem>
              <IonLabel>Option 1</IonLabel>
              <IonRadio slot="start" value="option1" />
            </IonItem>
            <IonItem>
              <IonLabel>Option 2</IonLabel>
              <IonRadio slot="start" value="option2" />
            </IonItem>
            <IonItem>
              <IonLabel>Option 3</IonLabel>
              <IonRadio slot="start" value="option3" />
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

