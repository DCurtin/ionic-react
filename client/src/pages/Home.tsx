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

  useEffect(()=>{
    Storage.get({key: 'name'}).then(function(result)
    {
      var value : string
      value = String(result.value);
      console.log(result.value);
      setUserName(value);
      
    })
  },[])

  return (
      <IonContent>
        <IonHeader>
        <IonToolbar>
          <IonTitle>MDY114 THIS IS MY HOME PAGE {userName} </IonTitle>
          <IonButton onClick={() => logout(history)}>Logout</IonButton>
        </IonToolbar>
      </IonHeader>
        {useEffectToGetAccounts()}
      </IonContent>
  )
};

function logout(history : any){
  var url = '/logoutServer'
  var options = {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

    sessionHandler.callOutFetch(url, options).then(()=>{
    history.replace('/login');
  })
}

function useEffectToGetAccounts(){
  const [result, setResult] = useState([{any : String}]);
  useEffect(()=>{
    getAccounts().then(function(data : any){
    setResult(data);
    });
  }, []);
  return <IonList>
          <IonItem>SFID And Name</IonItem>
          {(result.map(function(row: any, i : any){
            //console.log(row);
            return <IonItem>{row['sfid']}  {row['name']} <IonButton onClick={ () => createTransaction(row['sfid'])}> Create Transaction </IonButton></IonItem>
          }))}
        </IonList>
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
