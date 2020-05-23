import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonButton, IonInput, IonGrid, IonRow, IonCol, IonCard, IonImg } from '@ionic/react';

import { useHistory } from 'react-router-dom';

import React, {useState} from 'react';

import sessionHandler from '../helpers/sessionHandler'

import './Login.css';

const Login: React.FC = () => {
  var gridView = true;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  var inputFieldSetters = [setUsername, setPassword];

  const history = useHistory();
  // onKeyUp={e => e.key === 'Enter' ? login(username, password, history, setUsername, setPassword) : null} 
  return gridView ? (
    <IonPage>
      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center" >
          <IonCol size="5">
            <IonCard>
              <IonGrid >
                <IonRow><IonCol class='imageContainer'>  <img src={'/assets/CommunityMidlandLogo.gif'} /> </IonCol></IonRow>
                <IonRow class='rowcoloring'><IonCol> <IonItem> <IonInput class='item-input' value={username} placeholder="User Name" onIonChange={e => setUsername(e.detail.value!)} clearInput></IonInput></IonItem> </IonCol></IonRow>
                <IonRow class='rowcoloring'><IonCol> <IonItem> <IonInput class='item-input' type="password" value={password} placeholder="Password" onIonChange={e => setPassword(e.detail.value!)} clearInput></IonInput> </IonItem> </IonCol></IonRow>
                <IonRow class='rowcoloring'><IonCol><IonButton expand='full' onClick={() => {login(username, password, history, setUsername, setPassword)}}> Log In </IonButton></IonCol></IonRow>
              </IonGrid>
            </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  ) 
  :(
    <IonPage>
      <IonContent>
        <IonCard>
            <IonList>
              <IonItem><IonInput value={username} placeholder="Username" onIonChange={e => setUsername(e.detail.value!)} clearInput></IonInput></IonItem>
              <IonItem><IonInput type="password" value={password} placeholder="Password" onIonChange={e => setPassword(e.detail.value!)} clearInput></IonInput></IonItem>
              <IonItem><IonButton onClick={() => {login(username, password, history, setUsername, setPassword)}}> Sign In </IonButton></IonItem>
            </IonList>
        </IonCard>
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

      setUsername('');
      setPassword('');
      history.push('/home');
    })
  }).catch(function(error){
      console.log(error);
  })
}

export default Login;
