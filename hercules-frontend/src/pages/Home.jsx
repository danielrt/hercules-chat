import { IonRippleEffect, 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonList,
  IonListHeader,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonFooter
 } from '@ionic/react';
import { trashOutline, 
  micCircleOutline,
  sendSharp
} from 'ionicons/icons';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import HistoryItem from '../components/HistoryItem';
import { useState, useEffect } from 'react';
import  * as HerculesServerConnect  from '../hercules_modules/HerculesServerConnect';
import './Home.css';

const Home = () => {

  const [historyItens, setHistoryItens] = useState([]);
  const [textToSpeech, setTextToSpeech] = useState("");
  const [transcript, setTranscript] = useState("");
  const [inputTextValue, setInputTextValue] = useState("");
  const [isMessageTyped, setIsMessageTyped] = useState(false);

  VoiceRecorder.requestAudioRecordingPermission().then((result) => console.log(result.value));

  useEffect(() => {
    async function playAudio() {
      if(textToSpeech !== "") {
        var audioBlob = await HerculesServerConnect.tts(textToSpeech);
  
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        
        var historyItem = {
          msg : textToSpeech,
          userName : "Hercules",
          date : new Date()
        };
  
        var newHistoryItens = [historyItem].concat(historyItens);
        setHistoryItens(newHistoryItens);
      }
    }

    playAudio();

  }, [textToSpeech]);

  useEffect(() => {
    if(transcript !== "") {
      var historyItem = {
        msg : transcript,
        userName : 'Você',
        date : new Date()
      };

      var newHistoryItens = [historyItem].concat(historyItens);
      setHistoryItens(newHistoryItens);

      async function sendTextToHerculesAI(text) {
        var answerFromAI = await HerculesServerConnect.askHerculesAI(text);
        if(answerFromAI['isCommand'] !== true) {
          setTextToSpeech(answerFromAI['answer']);
        }
        else {
          setTextToSpeech("Executando o comando ".concat(answerFromAI['answer']));
          await HerculesServerConnect.sendHerculesCommand(answerFromAI['answer']);
        }
      }
      sendTextToHerculesAI(transcript);
    }
  }, [transcript]);

  async function startListening() {
    console.log("start listening");
    var hasPermission = await VoiceRecorder.hasAudioRecordingPermission();
    if(hasPermission.value) {
      console.log("VoiceRecorder is available");
      VoiceRecorder.startRecording()
      .then((result) => console.log(result.value))
      .catch(error => console.log(error));

    }
    else {
      console.log("VoiceRecorder is not available");
    }
  }

  function stopListening() {
    console.log("stop listening");
    VoiceRecorder.stopRecording()
    .then(async (result) => {
      var mimeType = result.value.mimeType.split(";")[0];
      var audioBase64 = "data:".concat(mimeType, ";base64,", result.value.recordDataBase64);
      var text = await HerculesServerConnect.stt(audioBase64);
      setTranscript(text);
    })
    .catch(error => console.log(error));
  }

  async function clearChat() {
    await HerculesServerConnect.resetChat();
    setHistoryItens([]);
  }

  function sendMessageFromInputText() {
    if(inputTextValue !== "") {
      setTranscript(inputTextValue);
      setInputTextValue("");
      setIsMessageTyped(false);
    }
  }

  function onTextTyped(e) {
    setInputTextValue(e.target.value);
    if(e.target.value !== "") {
      if(!isMessageTyped) {
        setIsMessageTyped(true);
      }
    }
    else {
      setIsMessageTyped(false);
    }
  }

  function handleKey(e) {
    if(e.key == "Enter") {
      sendMessageFromInputText();
    }
  }

  function SendButton({ isFromKeyBoard }) {
    if(isFromKeyBoard) {
      return  <IonButton fill="clear" aria-label="Enviar" onClick={sendMessageFromInputText}>
                <IonIcon slot="icon-only" className='mic-icon' icon={sendSharp}></IonIcon>
              </IonButton>
    }
    else {
      return  <IonButton shape="round" fill="clear" className="ion-activatable" onTouchStart={startListening} onTouchEnd={stopListening} onMouseDown={startListening} onMouseUp={stopListening}>
                <IonIcon slot="icon-only" className='mic-icon' icon={micCircleOutline}></IonIcon>
                <IonRippleEffect></IonRippleEffect>
              </IonButton>
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>HÉRCULES</IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={clearChat}>
              <IonIcon slot="icon-only" icon={trashOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel>Histórico de Interação</IonLabel>
          </IonListHeader>
          {historyItens && historyItens.map((item) => (
                <HistoryItem item={item} key={item.date.getTime()} />
            ))}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonInput onKeyDown={handleKey} name='inputTextAI' fill="outline" placeholder="Digite um comando para o Hércules" value={inputTextValue} onIonInput={onTextTyped}>
                </IonInput>
              </IonCol>
              <IonCol size='auto'>
                <SendButton isFromKeyBoard={isMessageTyped} ></SendButton>
                <div style={{ display : "none" }}>{textToSpeech}</div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
