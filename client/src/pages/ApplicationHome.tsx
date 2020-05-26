import { IonContent, IonPage, IonList, IonItem, IonButton, IonListHeader, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import React, {useState, useEffect, Component} from 'react';
import sessionHandler from '../helpers/sessionHandler';
import { useHistory } from 'react-router-dom';
import styles from './Home.module.css';


const ApplicationHome: React.FC = (props : any) => {
    const accountTypes = ['IRA', 'Roth'];
    const [accountType, setAccountType] = useState(accountTypes[0]);
    const history = useHistory();
    
    return (
        <IonPage>
        <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>
              Welcome to Midland
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Account Type</IonLabel>
            <IonSelect value={accountType} placeholder="Select One" onIonChange={e => setAccountType(e.detail.value)}>
              <IonSelectOption value="IRA">IRA</IonSelectOption>
              <IonSelectOption value="Roth">Roth</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{nextState(accountType, history)}}>Next</IonButton>
          </IonItem>
          </IonList>
        </IonContent>
    </IonPage>)
}

function nextState(accountType: String, history: any){
    history.push('/AppId', {'AccountType':accountType});
}

export default ApplicationHome;
