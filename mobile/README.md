# Mobile - ENEM Análise App

Aplicativo móvel desenvolvido com React Native e Expo para análise de provas e redações do ENEM.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar Expo
npm start

# Rodar no Android
npm run android

# Rodar no iOS
npm run ios
```

## ⚙️ Configuração

Edite `src/services/api.js` e configure o IP correto da API:

```javascript
// Android Emulator
const API_BASE_URL = 'http://10.0.2.2:3000/api';

// Dispositivo físico (use seu IP local)
const API_BASE_URL = 'http://192.168.1.100:3000/api';

// iOS Simulator
const API_BASE_URL = 'http://localhost:3000/api';
```

## 📱 Funcionalidades

- Dashboard com estatísticas
- Envio e análise de redações
- Visualização de provas do ENEM
- Matérias e assuntos mais cobrados
- Estatísticas detalhadas de desempenho

## 🎨 Tecnologias

- React Native
- Expo
- React Navigation
- Axios
- React Native Paper

## 📝 Autor

Criação: @HARRISONCOSTA
