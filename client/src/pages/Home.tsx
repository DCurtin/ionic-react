import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonButton } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import React, {useState} from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const { Storage } = Plugins;

const Home: React.FC = () => {
  var collection = [{any : String}];
  const [result, setResult] = useState([{any : String}]);
  const [userName, setUserName] = useState('');

  console.log(result.length)
  console.log(result[0])
  if(result.length === 1){

    getAccounts().then(function(data){
    console.log('in get accounts response');
    console.log(data);
    console.log(data[0].sfid);
    //return data[0].sfid;
    /*data?.read().then(function({done, value}){
      if(done){
        console.log('done')
        return 'done'
      }
      var decoder = new TextDecoder();
      
      console.log(value);
      console.log(decoder.decode(value))
      
    })*/
    setResult(data);
    
  }).finally(function(){
    console.log('done');

  });
  }

  if(userName === '')
  {
    Storage.get({key: 'name'}).then(function(result)
    {
      var value : string
      value = String(result);
      console.log(result);
      setUserName(value);
      
    })
  }

  return (result.length === 1) ? (
    <IonPage>
      <IonHeader>
        <IonToolbar>
  <IonTitle>MDY114 THIS IS MY HOME PAGE {userName} </IonTitle>
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
  ) : (
      <IonContent>
        <IonHeader>
        <IonToolbar>
          <IonTitle>MDY114 THIS IS MY HOME PAGE {userName} </IonTitle>
        </IonToolbar>
      </IonHeader>
        <IonList>
          <IonItem>SFID And Name</IonItem>
          {(result.map(function(row: any, i : any){
            console.log(row);
            return <IonItem>{row['sfid']}  {row['name']} <IonButton onClick={ () => createTransaction(row['sfid'])}> Create Transaction </IonButton></IonItem>
          }))}
        </IonList>
      </IonContent>
  );
};


function getAccounts(){
  var url = '/account';
  var options = {
    method : 'POST'
  }
  return fetch(url, options).then( function(response){
    console.log('in fetch');
    return response.json().then(function(data)
    {
      console.log('in fetch json');
      console.log(data);
      return data;
    })
    //return response.body?.getReader();
  })
}

function createTransaction(accountId : String)
{
  console.log(accountId)
  var url = '/createTransaction';
  var options = {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'sfid' : accountId
    })
  }

  return fetch(url, options);
}

function login(){}

function authenticate(){
  var url = 'https://test.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9ahGHqp.k2_wp5KNZXDK5mBqaJaRv6ss6l7gQkGLZfriwyGa_1aRXE88g0W5oT9rwlJQ31ieo52ucBrJm&redirect_uri=http://localhost:8100&state=init&prompt=login&display=touch';
  let browserRef = window.open(url, '_blank', 'location=no');
  browserRef?.addEventListener("loadstart", (event: any) => {
    console.log(event.url);
    if ((event.url).indexOf('?token=') !== -1) {
      let token = event.url.slice(event.url.indexOf('?token=') + '?token='.length);
      // here is your token, now you can close the InAppBrowser
      browserRef?.close();
    }
  })
  
}

export default Home;
