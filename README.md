# Nossa Via

Front-end do TCC de Análise e Desenvolvimento de Sistemas da FATEC Ipiranga. O projeto consiste em um aplicativo mobile Android para publicação de denúnicas de problemas em vias públicas, como por exemplo buracos e falta de sinalização. 

Para mais detalhes sobre a documentação visitar [Documentacao-TCC-NossaVia](https://github.com/frsouzaa/Documentacao-TCC-NossaVia).

## Recomendações
- Utilizar a versão `20.11.1` do Node
- Utilizar a versão `10.7.0` do NPM

## Dependências

- Configurar a URL base do back-end na variável de ambiente `EXPO_PUBLIC_BASE_URL` em um arquivo .env
- Configurar o token da api do google na variável de ambiente `EXPO_PUBLIC_GOOGLE_API_KEY` em um arquivo .env
- Instalar as dependências com o comando:
```shell
npm i
```
- Instalar o CLI do expo com o comando:
```shell
npm install --global eas-cli
```
- Realizar login no expo com o comando:
```shell
eas login
```


## Rodar o projeto

- Iniciar a aplicação com o comando: 
```shell
npm start
``` 
- Ler o QRCode com o aplicativo do expo instalado no celular

## Build

- O build da aplicação pode ser feito com o comando 
```shell
eas build --platform android --profile preview
```
- O build poderá ser acompanhdo na página do expo do usuário que foi realizado o `eas login`.
