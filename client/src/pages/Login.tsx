import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonButton, IonInput } from '@ionic/react';

import { useHistory } from 'react-router-dom';

import React, {useState} from 'react';

import sessionHandler from '../helpers/sessionHandler'

import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  var inputFieldSetters = [setUsername, setPassword];

  const history = useHistory();

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
              <IonItem><IonInput type="password" value={password} placeholder="Enter Input" onKeyUp={e => e.key === 'Enter' ? login(username, password, history, setUsername, setPassword) : null} onIonChange={e => setPassword(e.detail.value!)} clearInput></IonInput></IonItem>
              <IonItem><IonButton onClick={() => {login(username, password, history, setUsername, setPassword)}}> Sign In </IonButton></IonItem>
            </IonList>
      </IonContent>
    </IonPage>
  )
};

function login(username: String, password: String, history : any, setUsername: Function, setPassword: Function){
  var un = username;
  var pw = password;

  console.log(un + '  ' + pw);
  
  if(un === '' || pw === ''){
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
      sessionHandler.saveSession(data['token'], data['user'].name, 'test');

      //setUsername('');
      //setPassword('');
      history.push('/home');
    })
  }).catch(function(error){
      console.log(error);
  })
}

export default Login;
