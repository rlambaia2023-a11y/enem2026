# Backend - API ENEM Análise

API REST para o sistema de análise de provas e redações do ENEM.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Configurar banco de dados
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# Criar banco de dados
createdb enem_analise

# Executar migrações
npm run migrate

# Iniciar servidor
npm run dev
```

## 📦 Dependências

- express - Framework web
- pg - Cliente PostgreSQL
- cors - CORS middleware
- dotenv - Variáveis de ambiente
- body-parser - Parse de requisições

## 🗄️ Banco de Dados

PostgreSQL com as seguintes tabelas:
- materias
- assuntos
- provas
- questoes
- redacoes
- simulados
- respostas_simulado
- estatisticas

## 🔌 Endpoints Principais

- `/api/provas` - Gerenciamento de provas
- `/api/redacoes` - Gerenciamento de redações
- `/api/materias` - Matérias e assuntos
- `/api/questoes` - Questões das provas

## 📝 Autor

Criação: @HARRISONCOSTA
