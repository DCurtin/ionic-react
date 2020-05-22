import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonButton, IonInput } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import './Login.css';

const { Storage } = Plugins;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goToHome, setGoToHome] = useState(false);
  console.log('rerunning')
  console.log(goToHome)
  return (!goToHome) ? (
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
              <IonItem><IonButton onClick={() => {login(username, password, setGoToHome)}}> Sign In </IonButton></IonItem>
            </IonList>
      </IonContent>
    </IonPage>
  ):redirectHome(setGoToHome);
};

function redirectHome(setGoToHome : Function)
{
  setGoToHome(false);
  return (<Redirect to='/home'/>);
}

function login(username: String, password: String, setGoToHome : Function){
  var un = username;
  var pw = password;
  console.log(un + '  ' + pw);

  if(un === '' || pw === ''){
    setGoToHome(false);
    return;
  }
  
  var url = '/loginServer'
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
  fetch(url, options).then(function(response :any){
    if(!response.ok){
      throw Error(response.statusText);
    }
    response.json().then(function(data : any){
      console.log('login json');
      console.log(data);
      Storage.set({key: 'token', value :data['token'] });
      Storage.set({key: 'name', value :data['user'].name });
      setGoToHome(true);
    })
  }).catch(function(error){
      console.log(error);
      setGoToHome(false);
  })
}

function authenticate(){
  var url = 'https://test.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9ahGHqp.k2_wp5KNZXDK5mBqaJaRv6ss6l7gQkGLZfriwyGa_1aRXE88g0W5oT9rwlJQ31ieo52ucBrJm&redirect_uri=http://localhost:8100&state=init&prompt=login&display=touch';
  let browserRef = window.open(url, '_blank', 'location=no');
  browserRef?.addEventListener("loadstart", (event: any) => {
    console.log(event.url);
    //if ((event.url).indexOf('?token=') !== -1) {
      //let token = event.url.slice(event.url.indexOf('?token=') + '?token='.length);
      // here is your token, now you can close the InAppBrowser
      browserRef?.close();
    //}
  })
  
}

export default Login;
