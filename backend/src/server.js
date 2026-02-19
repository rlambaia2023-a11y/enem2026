const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const routes = require('./routes');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api', routes);

// Rota de health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      erro: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada',
    path: req.path
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno do servidor',
    erro: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║     🎓 API ENEM ANÁLISE - Sistema de Provas e Redações    ║');
  console.log('║                                                            ║');
  console.log('║     Criação e Desenvolvimento: @HARRISONCOSTA             ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  console.log('');
  console.log('📌 Endpoints disponíveis:');
  console.log('   • GET    /api/provas');
  console.log('   • GET    /api/redacoes');
  console.log('   • POST   /api/redacoes');
  console.log('   • POST   /api/redacoes/:id/analisar');
  console.log('   • GET    /api/materias');
  console.log('   • GET    /api/materias/assuntos/mais-cobrados');
  console.log('   • GET    /api/questoes');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚠️  SIGTERM recebido, encerrando graciosamente...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n⚠️  SIGINT recebido, encerrando graciosamente...');
  await pool.end();
  process.exit(0);
});
