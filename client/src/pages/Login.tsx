import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonButton, IonInput } from '@ionic/react';

import React, {useState} from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Login.css';

const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
  <IonTitle>Login Page </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonList>
              <IonItem><IonTitle size="large">UserName</IonTitle></IonItem>
              <IonItem><IonInput value={username} placeholder="Enter Input" onIonChange={e => setUsername(e.detail.value!)} clearInput></IonInput></IonItem>
              <IonItem><IonTitle size="large">Password</IonTitle></IonItem>
              <IonItem><IonInput value={password} placeholder="Enter Input" onIonChange={e => setPassword(e.detail.value!)} clearInput></IonInput></IonItem>
              <IonItem><IonButton onClick={loginUser}></IonButton></IonItem>
            </IonList>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
      </IonContent>
    </IonPage>
  )
};

function loginUser()
{
  login(username, password);
}

function login(username: String, password: String){
  var url = '/login'
  var options ={
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'userName' : username,
      'passWord' : password
    })
  }

  fetch(url, options).then(function(response){
    response.json().then(function(data){
      console.log('login json');
      console.log(data);
    })
  })
}

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

export default Login;
