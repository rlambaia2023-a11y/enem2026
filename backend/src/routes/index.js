const express = require('express');
const router = express.Router();

const provaController = require('../controllers/provaController');
const redacaoController = require('../controllers/redacaoController');
const materiaController = require('../controllers/materiaController');
const questaoController = require('../controllers/questaoController');

// Rotas de Provas
router.get('/provas', provaController.listarProvas);
router.get('/provas/:id', provaController.obterProva);
router.post('/provas', provaController.criarProva);
router.put('/provas/:id', provaController.atualizarProva);
router.delete('/provas/:id', provaController.deletarProva);

// Rotas de Redações
router.get('/redacoes', redacaoController.listarRedacoes);
router.get('/redacoes/estatisticas', redacaoController.obterEstatisticas);
router.get('/redacoes/:id', redacaoController.obterRedacao);
router.post('/redacoes', redacaoController.criarRedacao);
router.post('/redacoes/:id/analisar', redacaoController.analisarRedacao);
router.put('/redacoes/:id', redacaoController.atualizarRedacao);
router.delete('/redacoes/:id', redacaoController.deletarRedacao);

// Rotas de Matérias
router.get('/materias', materiaController.listarMaterias);
router.get('/materias/estatisticas', materiaController.obterEstatisticas);
router.get('/materias/assuntos/mais-cobrados', materiaController.listarAssuntosMaisCobrados);
router.get('/materias/:id', materiaController.obterMateria);

// Rotas de Questões
router.get('/questoes', questaoController.listarQuestoes);
router.get('/questoes/:id', questaoController.obterQuestao);
router.post('/questoes', questaoController.criarQuestao);
router.post('/questoes/:id/verificar', questaoController.verificarResposta);
router.put('/questoes/:id', questaoController.atualizarQuestao);
router.delete('/questoes/:id', questaoController.deletarQuestao);

// Rota raiz
router.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'API ENEM Análise - Sistema de Análise de Provas e Redações',
    versao: '1.0.0',
    autor: 'Harrison Costa',
    endpoints: {
      provas: '/api/provas',
      redacoes: '/api/redacoes',
      materias: '/api/materias',
      questoes: '/api/questoes'
    }
  });
});

module.exports = router;
