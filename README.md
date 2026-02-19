# 🎓 ENEM Análise - Sistema Completo de Provas e Redações

Sistema completo para análise de provas e redações do ENEM, desenvolvido com React Native/Expo (mobile) e Node.js + PostgreSQL (backend).

**Criação e Desenvolvimento:** @HARRISONCOSTA

## 📋 Características

### ✨ Funcionalidades Principais

- **📝 Análise de Redações**
  - Envio e armazenamento persistente de redações
  - Análise automática das 5 competências do ENEM
  - Feedback detalhado com pontos fortes e melhorias
  - Histórico completo de todas as redações

- **📚 Matérias e Assuntos**
  - Todas as matérias cobradas no ENEM
  - Linguagens e Códigos
  - Matemática
  - Ciências Humanas
  - Ciências da Natureza
  - Assuntos mais cobrados com frequência

- **📊 Estatísticas Completas**
  - Desempenho geral em redações
  - Média por competência
  - Análise por matéria
  - Progresso ao longo do tempo

- **📖 Provas do ENEM**
  - Histórico de provas (2023, 2024)
  - Provas futuras agendadas (2025, 2026)
  - Questões por matéria e assunto
  - Status de cada prova

### 💾 Banco de Dados Persistente

Todos os dados são armazenados em PostgreSQL:
- ✅ Redações persistem entre sessões
- ✅ Análises são mantidas permanentemente
- ✅ Histórico completo sempre disponível
- ✅ Estatísticas atualizadas em tempo real

## 🏗️ Arquitetura

```
webapp/
├── backend/               # API Node.js + Express
│   ├── src/
│   │   ├── config/       # Configuração do banco
│   │   ├── controllers/  # Lógica de negócio
│   │   ├── models/       # Modelos de dados
│   │   ├── routes/       # Rotas da API
│   │   ├── migrations/   # Scripts de migração
│   │   └── server.js     # Servidor principal
│   └── package.json
│
└── mobile/               # App React Native/Expo
    ├── src/
    │   ├── screens/      # Telas do app
    │   ├── navigation/   # Navegação
    │   ├── services/     # Comunicação com API
    │   └── components/   # Componentes reutilizáveis
    ├── App.js
    └── package.json
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- Expo CLI
- Android Studio ou Xcode (opcional)

### 1️⃣ Configurar Backend

```bash
# Entrar no diretório do backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações do PostgreSQL

# Criar banco de dados PostgreSQL
createdb enem_analise

# Executar migrações (cria tabelas e insere dados iniciais)
npm run migrate

# Iniciar servidor
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### 2️⃣ Configurar Mobile

```bash
# Entrar no diretório do mobile
cd mobile

# Instalar dependências
npm install

# Iniciar Expo
npm start
```

### 3️⃣ Configurar IP da API no Mobile

Edite o arquivo `mobile/src/services/api.js` e ajuste o `API_BASE_URL`:

```javascript
// Para Android Emulator
const API_BASE_URL = 'http://10.0.2.2:3000/api';

// Para dispositivo físico (substitua pelo IP da sua máquina)
const API_BASE_URL = 'http://192.168.1.100:3000/api';

// Para iOS Simulator
const API_BASE_URL = 'http://localhost:3000/api';
```

## 📱 Utilizando o App

### Telas Disponíveis

1. **Início** - Dashboard com estatísticas e ações rápidas
2. **Provas** - Lista de provas do ENEM (realizadas e futuras)
3. **Redações** - Suas redações e análises
4. **Matérias** - Matérias e assuntos mais cobrados
5. **Estatísticas** - Desempenho detalhado

### Fluxo de Uso

1. **Nova Redação**
   - Clique no botão "+" na tela de redações
   - Preencha título, tema e texto
   - Envie para análise
   - Aguarde o processamento

2. **Analisar Redação**
   - Acesse os detalhes de uma redação
   - Clique em "Analisar Agora"
   - Veja as notas das 5 competências
   - Leia o feedback detalhado

3. **Ver Estatísticas**
   - Acesse a aba "Estatísticas"
   - Veja seu desempenho geral
   - Analise média por competência
   - Acompanhe seu progresso

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **materias** - Matérias do ENEM (Linguagens, Matemática, etc.)
- **assuntos** - Assuntos específicos de cada matéria
- **provas** - Provas do ENEM (históricas e futuras)
- **questoes** - Questões das provas
- **redacoes** - Redações enviadas pelos usuários
- **simulados** - Simulados realizados
- **respostas_simulado** - Respostas dos simulados
- **estatisticas** - Dados estatísticos gerais

### Competências da Redação (ENEM)

1. **Competência 1** - Domínio da norma culta (0-200 pontos)
2. **Competência 2** - Compreensão do tema (0-200 pontos)
3. **Competência 3** - Argumentação (0-200 pontos)
4. **Competência 4** - Coesão textual (0-200 pontos)
5. **Competência 5** - Proposta de intervenção (0-200 pontos)

**Nota Total:** 0-1000 pontos

## 🔌 API Endpoints

### Redações
- `GET /api/redacoes` - Listar redações
- `POST /api/redacoes` - Criar redação
- `GET /api/redacoes/:id` - Obter detalhes
- `POST /api/redacoes/:id/analisar` - Analisar redação
- `GET /api/redacoes/estatisticas` - Estatísticas

### Provas
- `GET /api/provas` - Listar provas
- `GET /api/provas/:id` - Obter detalhes com questões

### Matérias
- `GET /api/materias` - Listar matérias
- `GET /api/materias/:id` - Obter matéria com assuntos
- `GET /api/materias/assuntos/mais-cobrados` - Top assuntos
- `GET /api/materias/estatisticas` - Estatísticas por matéria

### Questões
- `GET /api/questoes` - Listar questões
- `POST /api/questoes/:id/verificar` - Verificar resposta

## 🎯 Matérias do ENEM

### 1. Linguagens e Códigos 🗣️
- Interpretação de textos
- Figuras de linguagem
- Funções da linguagem
- Variação linguística
- Gêneros textuais
- Literatura Brasileira
- Gramática
- Intertextualidade

### 2. Matemática 🔢
- Porcentagem
- Razão e Proporção
- Geometria Plana
- Funções
- Probabilidade
- Estatística
- Geometria Espacial
- Trigonometria

### 3. Ciências Humanas 🌍
- Brasil Colônia
- Era Vargas
- Ditadura Militar
- Escravidão no Brasil
- Geopolítica Mundial
- Urbanização
- Movimentos Sociais
- Meio Ambiente

### 4. Ciências da Natureza 🔬
- Mecânica
- Eletricidade
- Química Orgânica
- Estequiometria
- Ecologia
- Genética
- Citologia
- Evolução

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- dotenv
- cors

### Mobile
- React Native
- Expo
- React Navigation
- Axios
- React Native Paper
- Expo Vector Icons

## 📝 Scripts Disponíveis

### Backend
```bash
npm start      # Iniciar servidor em produção
npm run dev    # Iniciar com nodemon (desenvolvimento)
npm run migrate # Executar migrações do banco
```

### Mobile
```bash
npm start      # Iniciar Expo
npm run android # Abrir no Android
npm run ios    # Abrir no iOS
npm run web    # Abrir no navegador
```

## 🔧 Troubleshooting

### Erro de conexão com API
- Verifique se o backend está rodando
- Confira o IP configurado em `mobile/src/services/api.js`
- Certifique-se que o firewall permite conexões na porta 3000

### Erro no banco de dados
- Verifique se o PostgreSQL está rodando
- Confira as credenciais no arquivo `.env`
- Execute `npm run migrate` para criar as tabelas

### Erro no Expo
- Limpe o cache: `expo start -c`
- Reinstale as dependências: `rm -rf node_modules && npm install`

## 👨‍💻 Autor

**Harrison Costa**
- Desenvolvimento completo do sistema
- Arquitetura e design
- Implementação backend e mobile

## 📄 Licença

MIT License - Livre para uso educacional e comercial

---

**CRIAÇÃO E DESENVOLVIMENTO: @HARRISONCOSTA** 🚀

Desenvolvido com ❤️ para ajudar estudantes a se prepararem melhor para o ENEM!
