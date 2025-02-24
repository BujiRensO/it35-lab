import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { bookOutline, search, musicalNotes} from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom'; // Use 'react-router-dom' instead of 'react-router'

import Music from './home-tabs/Music';
import Feed from './home-tabs/Feed';
import Search from './home-tabs/Search';

const Home: React.FC = () => {
  const tabs = [
    { name: 'Feed', tab: 'feed', url: '/it35-lab/app/home/feed', icon: bookOutline },
    { name: 'Search', tab: 'search', url: '/it35-lab/app/home/search', icon: search },
    { name: 'Music', tab: 'music', url: '/it35-lab/app/home/music', icon: musicalNotes },
  ];

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {/* Use the `component` prop instead of `render` */}
          <Route exact path="/it35-lab/app/home/feed" component={Feed} />
          <Route exact path="/it35-lab/app/home/search" component={Search} />
          <Route exact path="/it35-lab/app/home/music" component={Music} />

          {/* Redirect to the default tab */}
          <Route exact path="/it35-lab/app/home">
            <Redirect to="/it35-lab/app/home/feed" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          {tabs.map((item, index) => (
            <IonTabButton key={index} tab={item.tab} href={item.url}>
              <IonIcon icon={item.icon} />
              <IonLabel>{item.name}</IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Home;
