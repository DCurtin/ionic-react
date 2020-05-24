import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import React, {useState, useEffect, Component} from 'react';
import ExploreContainer from '../components/ExploreContainer';
import sessionHandler from '../helpers/sessionHandler';
import { useHistory } from 'react-router-dom';
import styles from './Home.module.css';

const { Storage } = Plugins;

const Home: React.FC = () => {
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [result, setResult] = useState([{any : String}]);
  
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

  useEffect(()=>{
    if(result?.length !== 1 && result !== null)
    {
      return;
    }

    getAccounts().then(function(data : any){
      setResult(data);
    });
  }, [result]);

  return (
    <IonPage>
      <IonContent className={styles.ionContent}>
        <IonHeader>
        <IonToolbar className={styles.ionToolbar}>
          <IonTitle>Account Page {userName}</IonTitle>
          <IonButton className={styles.ionButton} size='small' onClick={() => logout(history, setUserName)}>Logout</IonButton>
        </IonToolbar>
      </IonHeader>
        {useEffectToGetAccounts(result)}
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

function logout(history : any, setUserName : Function, setResult : Function){
  var url = '/logoutServer'
  var options = {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

    sessionHandler.callOutFetch(url, options).then(()=>{
    setUserName('');
    setResult(null);
    history.replace('/login');
  })
}

function useEffectToGetAccounts(result : any){
  return result !== undefined ? (
        <IonGrid>
          <IonRow className={[styles.ionRowColoring, styles.ionRowHeader].join(' ')}>
            <IonCol>SFID</IonCol>
            <IonCol>Name</IonCol>
            <IonCol>Create Transaction</IonCol>
          </IonRow>
          {(result.map(function(row: any, i : any){
            //console.log(row);
            return <IonRow className={styles.ionRowColoring}><IonCol>{row['sfid']}</IonCol>  <IonCol>{row['name']}</IonCol> <IonCol><IonButton onClick={ () => createTransaction(row['sfid'])}> Create Transaction </IonButton></IonCol></IonRow>
          }))}
        </IonGrid>):
        (<IonGrid>
        <IonRow>
          <IonCol>SFID</IonCol>
          <IonCol>Name</IonCol>
          <IonCol>Create Transaction</IonCol>
        </IonRow>
        <IonRow className={styles.ionRowColoring}><IonCol> col 1</IonCol> <IonCol> col 2</IonCol> <IonCol> col 3</IonCol></IonRow>
        <IonRow className={styles.ionRowColoring}><IonCol> col 1</IonCol> <IonCol> col 2</IonCol> <IonCol> col 3</IonCol></IonRow>
        <IonRow className={styles.ionRowColoring}><IonCol> col 1</IonCol> <IonCol> col 2</IonCol> <IonCol> col 3</IonCol></IonRow>
        </IonGrid>)
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
