# Chat de Interação com o Hércules

Este repositório contém os códigos para aplicação web de chat com o hercules.

## Dependências
Para utilizar os códigos execute as linhas de comando a seguir para instalar os componentes necessários:

Para instalação do Nodejs:

```commandline
curl -fsSL https://fnm.vercel.app/install | bash

source ~/.bashrc

fnm use --install-if-missing 22


```
Após a instalação, verifique que os comandos estão disponíveis no sistema:

```commandline
node -v

npm -v
```
Instale o ionic:

```commandline
npm install -g @ionic/cli
```

Instalação das dependências do componente de backend:
```commandline
cd hercules-backend/

npm i
```

## Configuração do acesso a OPENAI

Crie um arquivo de texto dentro do diretório **"hercules-backend"** com o nome **".env"**. Dentro 
desse arquivo, crie as variáveis de ambiente para acesso a api da OPENAI:

```
OPENAI_API_KEY=<SUA_CHAVE_OPENAI_AQUI>
OPENAI_BASE_URL=https://api.openai.com/v1
```

## Para rodar o chat
	
```commandline
cd hercules-backend/
npm start

cd ../hercules-frontend
ionic serve
```

