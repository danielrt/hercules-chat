const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('node:path'); 
const { exec } = require('child_process');

require('dotenv').config();

class HerculesController {

    constructor() {

        this.speechFile = path.resolve("./speech.mp3");
        

        this.openaiClient = new OpenAI({ apiKey : process.env.OPENAI_API_KEY, baseURL : process.env.OPENAI_BASE_URL });
        this.initOpenAIHistory();
    }

    initOpenAIHistory = () => {
        this.openaiHistory = [
            { 
                role: 'system', 
                content: 'Você se chama Hércules e é o operador virtual de uma empilhadeira \
                        no armazém da empresa. O armazém possui corredores, numerados de 1 a 5. \
                        Cada corredor possui espaços demarcados para \
                        pilhas de cargas, numerados de 1 a 10. No armazém existe um caminhão \
                        que precisa ser carregado ou descarregado. Você deve seguir as orientações para comandar a \
                        empilhadeira. Para isso, você tem a possibilidade de invocar os comandos a seguir:\n \
                        CARREGAR(x, y): leva a carga do corredor x no topo da pilha y para o caminhão;\n \
                        DESCARREGAR(x, y): leva a carga do caminhão para o corredor x na pilha y;\n \
                        \n \
                        Caso a fala do usuário não seja um comando, responda normalmente.\n \
                        \n \
                        Caso a fala do usuário contenha um comando, você deve responder da seguinte forma:\n \
                        RESPOSTA AO USUÁRIO: resposta falada ao usuário antes de executar o comando\n \
                        COMANDO: comando a ser invocado\n \
                        PEDIDO DE CONFIRMAÇÃO: Deseja que o comando seja executado?\n \
                        \n \
                        Você deve invocar apenas um comando por vez.\n \
                        \n \
                        Em caso de confirmação do comando pelo usuário, responda apenas:\n \
                        COMANDO: comando a ser executado' 
            }
        ]
    }

    resetChat = async (req, res) => {
        this.initOpenAIHistory();
        res.status(200).send();
    }

    executeCommand = async (req, res) => {
        if(req.body.hasOwnProperty('command')) {
            const { command } = req.body;

            console.log('executeCommand : ', command);
            // Regex para verificar o formato e extrair os valores
            const regex = /^(CARREGAR|DESCARREGAR)\((\d+),\s*(\d+)\)$/;
    
            const match = command.match(regex);
    
            if (match) {
                // match[1] é o comando, match[2] é x e match[3] é y
                const comando = match[1];
                const x = parseInt(match[2], 10);
                const y = parseInt(match[3], 10);

            
    
                if(comando === "CARREGAR") {

                    console.log('Comando CARREGAR: ', comando);
                    // manda o hercules executar aqui
                    /*
                    exec('ssh', (err, stdout, stderr) => {
                        if (err) {
                            console.log('ERRO AO CARREGAR : ', err);
                        }
                    };*/
                }
                if(comando === "DESCARREGAR") {

                    console.log('Comando CARREGAR: ', comando);

                    /*
                    exec('ssh', (err, stdout, stderr) => {
                        if (err) {
                            console.log('ERRO AO DESCARREGAR : ', err);
                        }
                    };*/
                }
            }
            else {
                console.log('Nenhum comando detectado: ', command); 
            }

            res.status(200).send();
        }
        else {
            console.log('Nenhum comando enviado pelo chat');
            res.status(400).send();
        }
    }
    
    askHerculesAI = async (req, res) => {
        if(req.body.hasOwnProperty('question')) {

            const { question } = req.body;

            var aiQuestionHistoryItem = {
                role: 'user', content: question
            }
            this.openaiHistory.push(aiQuestionHistoryItem);
    
            const chatCompletion = await this.openaiClient.chat.completions.create({
                messages: this.openaiHistory,
                model: 'gpt-4o-mini',
            });
    
            var aiAnswer = chatCompletion.choices[0].message.content;
            console.log("aiAnswer = ");
            console.log(aiAnswer);
            var aiAnswerHistoryItem = {
                role: 'assistant', content: aiAnswer
            }
            this.openaiHistory.push(aiAnswerHistoryItem);
    
            // Regex patterns to identify components for both formats
            const patternCommand = /COMANDO: (.*)/;
            const patternUserAnswer = /RESPOSTA AO USUÁRIO: (.*)/;
            const patternConfirmationRequest = /PEDIDO DE CONFIRMAÇÃO: (.*)/;

            var command = "";
            var confirmationRequest = "";
            var userAnswer = aiAnswer;

            let extractedText = patternCommand.exec(aiAnswer);
            if (extractedText) {
                console.log("command = ");
                console.log(extractedText);
                command = extractedText[1];
            }
    
            extractedText = patternUserAnswer.exec(aiAnswer);
            if (extractedText) {
                console.log("userResponse = ");
                console.log(extractedText);
                userAnswer = extractedText[1];
            }
    
            extractedText = patternConfirmationRequest.exec(aiAnswer);
            if (extractedText) {
                console.log("confirmationRequest = ");
                console.log(extractedText);
                confirmationRequest = extractedText[1];

            }

            var reqAnswer;
            if(command !== "") {
                if(confirmationRequest !== "") {
                    var extractedAIAnswers = [userAnswer, command, confirmationRequest];
                    reqAnswer = {
                        isCommand : false,
                        answer : extractedAIAnswers.join('\n')
                    }
                }
                else {
                    reqAnswer = {
                        isCommand : true,
                        answer : command
                    }
                }
            }
            else {
                reqAnswer = {
                    isCommand : false,
                    answer : userAnswer
                }
            }
            
            res.status(200).send(reqAnswer);
        } else {
            res.status(500).send();
        }
    }
    
    stt = async (req, res) => {
        if(req.body.hasOwnProperty('audioBase64')) {

            const { audioBase64 } = req.body;

            var splitedBase64 = audioBase64.split(",");
            var extension = splitedBase64[0].split(";")[0].split("/")[1];
            var pureBase64 = splitedBase64[1];

            var uploadedAudioFile = path.resolve("./uploaded_audio.".concat(extension));

            fs.writeFileSync(uploadedAudioFile, Buffer.from(pureBase64, 'base64'));

            //const audio = await fetch(audioBase64);

            //const blob = await audio.blob();
            //blob.lastModifiedDate = new Date();
            //blob.name = "audio";
    
            const transcription = await this.openaiClient.audio.transcriptions.create({
                file: fs.createReadStream(uploadedAudioFile),
                model: "whisper-1",
                language: "pt"
              });
                
            res.status(200).send(
                {
                    transcription : transcription.text
                }
            );
        } else {
            res.status(500).send();
        }
    }
    
    tts = async (req, res) => {
        if(req.body.hasOwnProperty('text')) {
                
            const { text } = req.body;

            const mp3 = await this.openaiClient.audio.speech.create({
                model: "tts-1",
                voice: "alloy",
                input: text,
              });
    
            const buffer = Buffer.from(await mp3.arrayBuffer());
            await fs.promises.writeFile(this.speechFile, buffer);

            res.status(200).send(buffer);
        } else {
            res.status(500).send();
        }
    }
}

module.exports =  HerculesController;





