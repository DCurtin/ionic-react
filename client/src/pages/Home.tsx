import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonButton } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import React, {useState, useEffect} from 'react';
import ExploreContainer from '../components/ExploreContainer';
import sessionHandler from '../helpers/sessionHandler';
import { useHistory } from 'react-router-dom';
import './Home.css';

const { Storage } = Plugins;

const Home: React.FC = () => {
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [initialized, setInitialized] = useState(false);
  
  console.log('fc refreshed');

  useEffect(()=>{
    if(userName !== '' && userName !== null){
      return;
    }

    Storage.get({key: 'name'}).then(function(result)
    {
      var value : string
      value = String(result.value);
      console.log(result.value);
      setUserName(value);
      
    })
  }, [userName]);

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
        <IonToolbar>
          <IonTitle>MDY114 THIS IS MY HOME PAGE {userName} </IonTitle>
          <IonButton onClick={() => logout(history, setUserName)}>Logout</IonButton>
        </IonToolbar>
      </IonHeader>
        {useEffectToGetAccounts()}
      </IonContent>
      </IonPage>
  )
};

function getUserName(){
  return Storage.get({key: 'name'}).then(function(result)
    {
      var value : string
      value = String(result.value);
      console.log(result.value);
      //setUserName(value);
      return value
      
    })
}

function logout(history : any, setUserName : Function){
  var url = '/logoutServer'
  var options = {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

    sessionHandler.callOutFetch(url, options).then(()=>{
    setUserName('');
    history.push('/login');
  })
}

function useEffectToGetAccounts(){
  const [result, setResult] = useState([{any : String}]);
  useEffect(()=>{
    if(result?.length !== 1 && result !== null)
    {
      return;
    }

    getAccounts().then(function(data : any){
    setResult(data);
    });
  }, [result]);
  return result !== undefined ? (<IonList>
          <IonItem>SFID And Name</IonItem>
          {(result.map(function(row: any, i : any){
            //console.log(row);
            return <IonItem>{row['sfid']}  {row['name']} <IonButton onClick={ () => createTransaction(row['sfid'])}> Create Transaction </IonButton></IonItem>
          }))}
        </IonList>):
        "You are not signed in."
}

function getAccounts(){
  var url = '/account';
  var options = {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    }}

  return sessionHandler.callOutFetch(url, options).then( function(response){
    if(!response?.ok){
      throw Error(response?.statusText);
    }
    console.log('in fetch');
    return response.json().then(function(data)
    {
      console.log('in fetch json');
      console.log(data);
      return data;
    })
    //return response.body?.getReader();
  }).catch(function(error : any){
    console.log(error);
    console.log('go back to login');
  })
}

function createTransaction(accountId : String)
{
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
  return sessionHandler.callOutFetch(url, options);

}

export default Home;
