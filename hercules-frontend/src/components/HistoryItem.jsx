import { IonItem, 
  IonLabel, 
  IonText, 
  IonNote } from '@ionic/react';

import './HistoryItem.css';

const HistoryItem = ({item}) => {  

    if(item.userName === 'Hercules') {
        return (
          <IonItem button={false} detail={false}>
            <div className="unread-indicator-wrapper" slot="start">
              <div className="unread-indicator-hercules"></div>
            </div>
            <IonLabel>
              <strong>Hércules</strong>
              <IonText>{item.msg}</IonText>
              <br />
            </IonLabel>
            <div className="metadata-end-wrapper" slot="end">
              <IonNote color="medium">{item.date.toLocaleString('en-GB',{hour12: false})}</IonNote>
            </div>
          </IonItem>
          );
    }
    else {
        return (
          <IonItem button={false} detail={false}>
            <div className="unread-indicator-wrapper" slot="start">
              <div className="unread-indicator-user"></div>
            </div>
            <IonLabel>
              <strong>{item.userName}</strong>
              <IonText>{item.msg}</IonText>
              <br />
            </IonLabel>
            <div className="metadata-end-wrapper" slot="end">
              <IonNote color="medium">{item.date.toLocaleString('en-GB',{hour12: false})}</IonNote>
            </div>
          </IonItem>
          );
    }

};

export default HistoryItem;