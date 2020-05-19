import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  var test = 1 + 2 + 3 + 4;
  var result;
  getAccounts().then(function(data){
    console.log('in get accounts response');
    console.log(data);
    console.log(data[0].sfid);
    result = data[0].sfid
    return data[0].sfid;
    /*data?.read().then(function({done, value}){
      if(done){
        console.log('done')
        return 'done'
      }
      var decoder = new TextDecoder();

      console.log(value);
      console.log(decoder.decode(value))

    })*/

  });
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
    return response.json().then(function(data)
    {
      console.log('in fetch json');
      console.log(data);
      return data;
    })
    //return response.body?.getReader();
  })
}

export default Home;
