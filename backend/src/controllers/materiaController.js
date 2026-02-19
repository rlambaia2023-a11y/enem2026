const Materia = require('../models/Materia');

exports.listarMaterias = async (req, res) => {
  try {
    const materias = await Materia.findAll();
    res.json({
      sucesso: true,
      dados: materias,
      total: materias.length
    });
  } catch (error) {
    console.error('Erro ao listar matérias:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar matérias',
      erro: error.message
    });
  }
};

exports.obterMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const materia = await Materia.findById(id);
    
    if (!materia) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Matéria não encontrada'
      });
    }

    const assuntos = await Materia.getAssuntos(id);
    
    res.json({
      sucesso: true,
      dados: {
        ...materia,
        assuntos
      }
    });
  } catch (error) {
    console.error('Erro ao obter matéria:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar matéria',
      erro: error.message
    });
  }
};

exports.listarAssuntosMaisCobrados = async (req, res) => {
  try {
    const { limit } = req.query;
    const assuntos = await Materia.getAssuntosMaisCobrados(limit || 20);
    
    res.json({
      sucesso: true,
      dados: assuntos,
      total: assuntos.length
    });
  } catch (error) {
    console.error('Erro ao listar assuntos mais cobrados:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar assuntos',
      erro: error.message
    });
  }
};

exports.obterEstatisticas = async (req, res) => {
  try {
    const estatisticas = await Materia.getEstatisticasPorMateria();
    
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
