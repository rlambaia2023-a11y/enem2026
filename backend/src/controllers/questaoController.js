const Questao = require('../models/Questao');

exports.listarQuestoes = async (req, res) => {
  try {
    const { materia_id, prova_id, nivel_dificuldade } = req.query;
    const questoes = await Questao.findAll({ 
      materia_id, 
      prova_id, 
      nivel_dificuldade 
    });
    
    res.json({
      sucesso: true,
      dados: questoes,
      total: questoes.length
    });
  } catch (error) {
    console.error('Erro ao listar questões:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar questões',
      erro: error.message
    });
  }
};

exports.obterQuestao = async (req, res) => {
  try {
    const { id } = req.params;
    const questao = await Questao.findById(id);
    
    if (!questao) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Questão não encontrada'
      });
    }

    res.json({
      sucesso: true,
      dados: questao
    });
  } catch (error) {
    console.error('Erro ao obter questão:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar questão',
      erro: error.message
    });
  }
};

exports.criarQuestao = async (req, res) => {
  try {
    const questao = await Questao.create(req.body);
    res.status(201).json({
      sucesso: true,
      mensagem: 'Questão criada com sucesso',
      dados: questao
    });
  } catch (error) {
    console.error('Erro ao criar questão:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar questão',
      erro: error.message
    });
  }
};

exports.atualizarQuestao = async (req, res) => {
  try {
    const { id } = req.params;
    const questao = await Questao.update(id, req.body);
    
    if (!questao) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Questão não encontrada'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Questão atualizada com sucesso',
      dados: questao
    });
  } catch (error) {
    console.error('Erro ao atualizar questão:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar questão',
      erro: error.message
    });
  }
};

exports.deletarQuestao = async (req, res) => {
  try {
    const { id } = req.params;
    await Questao.delete(id);
    
    res.json({
      sucesso: true,
      mensagem: 'Questão deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar questão:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar questão',
      erro: error.message
    });
  }
};

exports.verificarResposta = async (req, res) => {
  try {
    const { id } = req.params;
    const { resposta } = req.body;

    if (!resposta) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Resposta é obrigatória'
      });
    }

    const resultado = await Questao.verificarResposta(id, resposta);
    
    if (!resultado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Questão não encontrada'
      });
    }

    res.json({
      sucesso: true,
      dados: resultado
    });
  } catch (error) {
    console.error('Erro ao verificar resposta:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao verificar resposta',
      erro: error.message
    });
  }
};
