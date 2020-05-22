import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonButton } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import React, {useState} from 'react';
import ExploreContainer from '../components/ExploreContainer';
import { Redirect } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Home.css';

const { Storage } = Plugins;

const Home: React.FC = () => {
  const location = useLocation();
  const [result, setResult] = useState([{any : String}]);
  const [userName, setUserName] = useState('');

  //console.log(result.length)
  //console.log(result[0])
  if(result !== undefined && result.length <= 1 ){

    getAccounts().then(function(data : any){
    //console.log('in get accounts response');
    //console.log(data);
    //console.log(data[0].sfid);
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
    
    });
  }

  if(userName === '')
  {
    Storage.get({key: 'name'}).then(function(result)
    {
      var value : string
      value = String(result.value);
      console.log(result.value);
      setUserName(value);
      
    })
  }

  return (result === undefined || result.length === 1) ? (
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
          <IonButton onClick={() => logout(location)}>Logout</IonButton>
        </IonToolbar>
      </IonHeader>
        <IonList>
          <IonItem>SFID And Name</IonItem>
          {(result.map(function(row: any, i : any){
            //console.log(row);
            return <IonItem>{row['sfid']}  {row['name']} <IonButton onClick={ () => createTransaction(row['sfid'])}> Create Transaction </IonButton></IonItem>
          }))}
        </IonList>
      </IonContent>
  )
};

function logout(location : any){
  getToken().then(function(result){
    var userSession = result.value;
    var url = '/logout'
    var options = {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userSession' : userSession
      })
    }

    fetch(url, options).then(()=>{
      location.state('/login');
    })
  })
}

function getAccounts(){

  return getToken().then(function(result:any) {
    var userSession = result.value 
    console.log(userSession);
    console.log(result);
    var options = {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userSession' : userSession
      })
    }

    return makeRequestForAccounts(options);
  }).catch(function(err: any){
    console.log('error: ' + err);
    return [];
  })
  
}

function getToken(){
  return Storage.get({key: 'token'});
}

function makeRequestForAccounts(options : any){
  var url = '/account';
  return fetch(url, options).then( function(response){
    if(!response.ok){
      throw Error(response.statusText);
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
  return getToken().then(function(result){
    var userSession = result.value;
    console.log(accountId)
    var url = '/createTransaction';
    var options = {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'sfid' : accountId,
        'userSession' : userSession
      })
    }
    return fetch(url, options);
  })
}

export default Home;
