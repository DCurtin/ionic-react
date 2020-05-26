import { IonContent, IonPage, IonList, IonItem, IonButton, IonListHeader, IonLabel, IonSelect, IonSelectOption, IonInput, IonCard } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import React, {useState, useEffect, Component} from 'react';
import sessionHandler from '../helpers/sessionHandler';
import { useHistory } from 'react-router-dom';
import styles from './Home.module.css';

const ApplicationIdentity: React.FC = (props : any) => {
    const [formData, setFormData] = useState({firstName:'', lastName:'', social: '', email: '', dateOfBirth: ''});
    const history = useHistory();
    const updateForm = function(e : any){
        setFormData({
        ...formData,
          [e.target.name]: e.target.value
        });
    }
    return (
        <IonPage>
        <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>
              Please provide ID information
            </IonLabel>
          </IonListHeader>

          <IonItem>
          <IonCard>
                <IonLabel>Beneficiary</IonLabel>
                <IonInput class='item-input' name="firstName" value={formData.firstName} placeholder="First Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="lastName" value={formData.lastName} placeholder="Last Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="social" value={formData.social} placeholder="Social" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='email' class='item-input' name="email" value={formData.email} placeholder="Email" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='date' class='item-input' name="dateOfBirth" value={formData.dateOfBirth} placeholder="Date of Birth" onIonChange={e => updateForm(e!)} clearInput></IonInput>
            </IonCard>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{nextState(formData, history)}}>Next</IonButton>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{prevState(history)}}>Prev</IonButton>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{saveAndReturn(formData, history)}}>Save And Return</IonButton>
          </IonItem>
          </IonList>
        </IonContent>
    </IonPage>)
}

function nextState(formData:any, history: any){
    // {'formData':JSON.stringify(formData)}
    //save data to postGres
    //get session id
    //enage loading here
    var url = '/startApplication'
    var options ={
        method : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    fetch(url, options).then(function(response :any){

        if(!response.ok){
            console.log('failed to save state');
        }
        var sessionId = 'test1234'
        history.push('/AppBene', {'sessionId': sessionId});
    })
}

function prevState(history: any){
    history.goBack();
}

function saveAndReturn(formData: any, history: any){
    //history.push('/AppId', {'AccountType':accountType});
}

export default ApplicationIdentity;
