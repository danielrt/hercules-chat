import { getHerculesAddress, getPassword, getUser, setLogin } from "../helpers/Utils";
import axios from 'axios';

var serverAddress = "http://localhost:3000"

export async function sendHerculesCommand(herculesCmd) {

    var herculesExecuteCommandApiPoint = serverAddress.concat("/executeCommand");

    console.log("sendHerculesCommand = %s %s", herculesCmd, herculesExecuteCommandApiPoint);
    
    try {
        var response = await axios(
            {
                method: 'post',
                timeout : 5000,
                url: herculesExecuteCommandApiPoint,
                data: {
                    command: herculesCmd
                },
                headers : {
                    'Content-Type' : 'application/vnd.api+json'
                },
                maxBodyLength : Infinity,
                maxContentLength : Infinity
            }
        )
    
        console.log(response);
    
        if(response.status === 200) {
            return true;
        }
    }
    catch(e) {
        console.log(e);
    }

    return false;
}

export async function pingHercules() {
    var herculesPingApiPoint = serverAddress.concat("/ping");
    console.log(herculesPingApiPoint);

    console.log("pingHercules = %s", herculesPingApiPoint);

    try {
        var response = await axios(
            {
                method: 'get',
                timeout : 5000,
                url: herculesPingApiPoint,
            }
        )
    
        console.log(response);

        if(response.status === 200) {
            return true;
        }
    }
    catch(e) {
        console.log(e);
    }
    return false;

}

export async function askHerculesAI(question) {

    var herculesApiPoint = serverAddress.concat("/askHerculesAI");

    console.log("askHerculesAI = %s %s", question, herculesApiPoint);
    
    try {
        var response = await axios(
            {
                method: 'post',
                timeout : 5000,
                url: herculesApiPoint,
                data: {
                    question: question
                },
                headers : {
                    'Content-Type' : 'application/vnd.api+json'
                },
                maxBodyLength : Infinity,
                maxContentLength : Infinity
            }
        )
    
        console.log(response);
    
        if(response.status === 200) {
            return response.data;
        }
        
    }
    catch(e) {
        console.log(e);
    }

    return "";
}

export async function resetChat() {

    var herculesApiPoint = serverAddress.concat("/resetChat");

    console.log("resetChat = %s", herculesApiPoint);
    
    try {
        var response = await axios(
            {
                method: 'post',
                timeout : 5000,
                url: herculesApiPoint
            }
        )
    
        console.log(response);
    
        if(response.status === 200) {
            return true;
        }
        
    }
    catch(e) {
        console.log(e);
    }

    return false;
}

export async function stt(encodedAudio) {

    var herculesApiPoint = serverAddress.concat("/stt");

    console.log("askHerculesAI = %s", herculesApiPoint);
    
    try {
        var response = await axios(
            {
                method: 'post',
                timeout : 5000,
                url: herculesApiPoint,
                data: {
                    audioBase64: encodedAudio
                },
                headers : {
                    'Content-Type' : 'application/vnd.api+json'
                },
                maxBodyLength : Infinity,
                maxContentLength : Infinity
            }
        )
    
        console.log(response);
    
        if(response.status === 200) {
            return response.data["transcription"];
        }
        
    }
    catch(e) {
        console.log(e);
    }

    return "";
}

export async function tts(text) {

    var herculesApiPoint = serverAddress.concat("/tts");

    console.log("askHerculesAI = %s", herculesApiPoint);
    
    try {
        var response = await axios(
            {
                method: 'post',
                timeout : 5000,
                url: herculesApiPoint,
                data: {
                    text: text
                },
                responseType : 'blob',
                headers : {
                    'Content-Type' : 'application/vnd.api+json'
                },
                maxBodyLength : Infinity,
                maxContentLength : Infinity
            }
        )
    
        console.log(response);
    
        if(response.status === 200) {
            return response.data;
        }
        
    }
    catch(e) {
        console.log(e);
    }

    return null;
}