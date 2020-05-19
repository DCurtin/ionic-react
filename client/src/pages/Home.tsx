import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  var test = 1 + 2 + 3 + 4;
  var result = getAccounts();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
  <IonTitle>MDY114 THIS IS MY HOME PAGE {test} {result}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Ion Title Contect</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

function getAccounts(){
  var url = '/account';
  var options = {
    method : 'POST'
  }
  return fetch(url, options).then( function(response){
    console.log(response);
    return response.body;
  })
}

export default Home;
