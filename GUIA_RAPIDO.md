# 🚀 Guia Rápido - ENEM Análise

**Criação: @HARRISONCOSTA**

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Setup Automático

```bash
# Execute o script de setup
./setup.sh
```

### 2️⃣ Configurar PostgreSQL

```bash
# Criar banco de dados
createdb enem_analise

# OU usando psql
psql -U postgres -c "CREATE DATABASE enem_analise;"

# Executar migrações
cd backend
npm run migrate
cd ..
```

### 3️⃣ Iniciar Backend

```bash
./start-backend.sh
```

O servidor estará em: `http://localhost:3000`

### 4️⃣ Configurar IP no Mobile

Edite `mobile/src/services/api.js`:

```javascript
// Para Android Emulator
const API_BASE_URL = 'http://10.0.2.2:3000/api';

// Para seu celular (substitua pelo seu IP)
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

Para descobrir seu IP:
```bash
# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig
```

### 5️⃣ Iniciar Mobile

```bash
./start-mobile.sh
```

Escaneie o QR Code com o app Expo Go!

## 📱 Testando o App

1. **Criar Redação**
   - Abra o app
   - Vá em "Redações" → Botão "+"
   - Preencha e envie

2. **Analisar Redação**
   - Clique na redação criada
   - Toque em "Analisar Agora"
   - Veja sua nota e feedback!

3. **Ver Estatísticas**
   - Acesse a aba "Estatísticas"
   - Veja seu desempenho

## 🔧 Problemas Comuns

### Erro de conexão com API
```bash
# Verifique se o backend está rodando
curl http://localhost:3000/health

# Deve retornar: {"status":"OK",...}
```

### Banco não conecta
```bash
# Verifique se PostgreSQL está rodando
pg_isready

# Teste conexão
psql -U postgres -d enem_analise -c "SELECT 1;"
```

### App não conecta
1. Backend e mobile na mesma rede?
2. IP correto em `api.js`?
3. Porta 3000 liberada no firewall?

## 📊 Dados Disponíveis

O sistema já vem com:
- ✅ 5 Matérias do ENEM
- ✅ 40+ Assuntos mais cobrados
- ✅ 7 Provas (2023-2026)
- ✅ Dados de frequência

## 🎯 Funcionalidades

### Redações
- ✍️ Criar redação
- 📊 Análise automática
- 🎯 Nota 0-1000
- 📈 5 Competências
- 💬 Feedback detalhado

### Provas
- 📚 Histórico 2023-2024
- 📅 Futuras 2025-2026
- 📝 Questões por matéria

### Matérias
- 📖 Todas do ENEM
- 🔥 Assuntos mais cobrados
- 📊 Frequência de cada tema

### Estatísticas
- 📈 Desempenho geral
- 📊 Média por competência
- 📉 Evolução temporal

## 📞 Suporte

Consulte o README.md completo para:
- Documentação detalhada da API
- Estrutura do banco de dados
- Arquitetura do sistema
- Troubleshooting avançado

---

**CRIAÇÃO E DESENVOLVIMENTO: @HARRISONCOSTA** 🚀
