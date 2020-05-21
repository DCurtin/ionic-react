import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonButton, IonInput } from '@ionic/react';

import React, {useState} from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Login.css';


const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
  <IonTitle>Login Page </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
            <IonList>
              <IonItem><IonTitle size="large">UserName</IonTitle></IonItem>
              <IonItem><IonInput value={username} placeholder="Enter Input" onIonChange={e => setUsername(e.detail.value!)} clearInput></IonInput></IonItem>
              <IonItem><IonTitle size="large">Password</IonTitle></IonItem>
              <IonItem><IonInput type="password" value={password} placeholder="Enter Input" onIonChange={e => setPassword(e.detail.value!)} clearInput></IonInput></IonItem>
              <IonItem><IonButton onClick={() => {login(username, password); setPassword(''); setUsername('')}}> Sign In </IonButton></IonItem>
            </IonList>
      </IonContent>
    </IonPage>
  )
};

function login(this: any, username: String, password: String){
  var un = username;
  var pw = password;
  console.log(un + '  ' + pw);
  var url = 'https://ionic-reach-test-midland.herokuapp.com/loginServer'
  var options ={
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'userName' : un,
      'passWord' : pw
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
