import { 
  IonButton,
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  useIonRouter,
  IonInput, 
  IonInputPasswordToggle, 
  IonModal, 
  IonItem, 
  IonLabel, 
  IonText, 
  IonList, 
  IonToast
} from '@ionic/react';
import React, { useState } from 'react';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const doLogin = () => {
    navigation.push('/it35-lab/app', 'forward', 'replace');
  }

  const doRegister = () => {
    // You can add your registration logic here
    setShowToast(true); // Just a placeholder for successful registration
  }

  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonInput 
          label="Username" 
          value={username}
          onIonChange={(e) => setUsername(e.detail.value!)}
        />
        <IonInput 
          type="password" 
          label="Password" 
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
        >
          <IonInputPasswordToggle slot="end" />
        </IonInput>
        <IonButton onClick={() => doLogin()} expand="full">
          Login
        </IonButton>

        <IonButton onClick={() => setShowModal(true)} expand="full" color="secondary">
          Register
        </IonButton>

        {/* IonToast for successful registration */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Registration Successful!"
          duration={2000}
        />

        {/* IonModal for registration form */}
        <IonModal isOpen={showModal} onDidDismiss={() => closeModal()}>
          <IonContent className="ion-padding">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Register</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={closeModal}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Username</IonLabel>
                <IonInput 
                  value={username}
                  onIonChange={(e) => setUsername(e.detail.value!)} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput 
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput 
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)} 
                >
                  <IonInputPasswordToggle slot="end" />
                </IonInput>
              </IonItem>
            </IonList>
            <IonButton expand="full" onClick={doRegister}>
              Register
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Login;
