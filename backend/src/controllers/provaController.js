const Prova = require('../models/Prova');

exports.listarProvas = async (req, res) => {
  try {
    const provas = await Prova.findAll();
    res.json({
      sucesso: true,
      dados: provas,
      total: provas.length
    });
  } catch (error) {
    console.error('Erro ao listar provas:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar provas',
      erro: error.message
    });
  }
};

exports.obterProva = async (req, res) => {
  try {
    const { id } = req.params;
    const prova = await Prova.findById(id);
    
    if (!prova) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Prova não encontrada'
      });
    }

    const questoes = await Prova.getQuestoes(id);
    
    res.json({
      sucesso: true,
      dados: {
        ...prova,
        questoes
      }
    });
  } catch (error) {
    console.error('Erro ao obter prova:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar prova',
      erro: error.message
    });
  }
};

exports.criarProva = async (req, res) => {
  try {
    const prova = await Prova.create(req.body);
    res.status(201).json({
      sucesso: true,
      mensagem: 'Prova criada com sucesso',
      dados: prova
    });
  } catch (error) {
    console.error('Erro ao criar prova:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar prova',
      erro: error.message
    });
  }
};

exports.atualizarProva = async (req, res) => {
  try {
    const { id } = req.params;
    const prova = await Prova.update(id, req.body);
    
    if (!prova) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Prova não encontrada'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Prova atualizada com sucesso',
      dados: prova
    });
  } catch (error) {
    console.error('Erro ao atualizar prova:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar prova',
      erro: error.message
    });
  }
};

exports.deletarProva = async (req, res) => {
  try {
    const { id } = req.params;
    await Prova.delete(id);
    
    res.json({
      sucesso: true,
      mensagem: 'Prova deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar prova:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar prova',
      erro: error.message
    });
  }
};
