const Redacao = require('../models/Redacao');

exports.listarRedacoes = async (req, res) => {
  try {
    const { status, prova_id } = req.query;
    const redacoes = await Redacao.findAll({ status, prova_id });
    
    res.json({
      sucesso: true,
      dados: redacoes,
      total: redacoes.length
    });
  } catch (error) {
    console.error('Erro ao listar redações:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar redações',
      erro: error.message
    });
  }
};

exports.obterRedacao = async (req, res) => {
  try {
    const { id } = req.params;
    const redacao = await Redacao.findById(id);
    
    if (!redacao) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Redação não encontrada'
      });
    }

    res.json({
      sucesso: true,
      dados: redacao
    });
  } catch (error) {
    console.error('Erro ao obter redação:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar redação',
      erro: error.message
    });
  }
};

exports.criarRedacao = async (req, res) => {
  try {
    const { titulo, tema, texto, prova_id } = req.body;

    if (!titulo || !tema || !texto) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Título, tema e texto são obrigatórios'
      });
    }

    const redacao = await Redacao.create({ titulo, tema, texto, prova_id });
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Redação enviada para análise com sucesso',
      dados: redacao
    });
  } catch (error) {
    console.error('Erro ao criar redação:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar redação',
      erro: error.message
    });
  }
};

exports.analisarRedacao = async (req, res) => {
  try {
    const { id } = req.params;
    
    const redacao = await Redacao.findById(id);
    if (!redacao) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Redação não encontrada'
      });
    }

    if (redacao.status === 'analisada') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Redação já foi analisada'
      });
    }

    const redacaoAnalisada = await Redacao.analisar(id);
    
    res.json({
      sucesso: true,
      mensagem: 'Redação analisada com sucesso',
      dados: redacaoAnalisada
    });
  } catch (error) {
    console.error('Erro ao analisar redação:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao analisar redação',
      erro: error.message
    });
  }
};

exports.atualizarRedacao = async (req, res) => {
  try {
    const { id } = req.params;
    const redacao = await Redacao.update(id, req.body);
    
    if (!redacao) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Redação não encontrada'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Redação atualizada com sucesso',
      dados: redacao
    });
  } catch (error) {
    console.error('Erro ao atualizar redação:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar redação',
      erro: error.message
    });
  }
};

exports.deletarRedacao = async (req, res) => {
  try {
    const { id } = req.params;
    await Redacao.delete(id);
    
    res.json({
      sucesso: true,
      mensagem: 'Redação deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar redação:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar redação',
      erro: error.message
    });
  }
};

exports.obterEstatisticas = async (req, res) => {
  try {
    const estatisticas = await Redacao.getEstatisticas();
    
    res.json({
      sucesso: true,
      dados: estatisticas
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar estatísticas',
      erro: error.message
    });
  }
};
