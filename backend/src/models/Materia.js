const pool = require('../config/database');

class Materia {
  static async findAll() {
    const result = await pool.query(`
      SELECT m.*,
        COUNT(DISTINCT a.id) as total_assuntos,
        COUNT(DISTINCT q.id) as total_questoes
      FROM materias m
      LEFT JOIN assuntos a ON a.materia_id = m.id
      LEFT JOIN questoes q ON q.materia_id = m.id
      GROUP BY m.id
      ORDER BY m.id
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM materias WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getAssuntos(materiaId) {
    const result = await pool.query(`
      SELECT a.*,
        COUNT(q.id) as total_questoes
      FROM assuntos a
      LEFT JOIN questoes q ON q.assunto_id = a.id
      WHERE a.materia_id = $1
      GROUP BY a.id
      ORDER BY a.frequencia_enem DESC, a.nome
    `, [materiaId]);
    return result.rows;
  }

  static async getAssuntosMaisCobrados(limit = 10) {
    const result = await pool.query(`
      SELECT a.*, m.nome as materia_nome, m.cor as materia_cor,
        COUNT(q.id) as total_questoes
      FROM assuntos a
      JOIN materias m ON m.id = a.materia_id
      LEFT JOIN questoes q ON q.assunto_id = a.id
      GROUP BY a.id, m.id
      ORDER BY a.frequencia_enem DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  static async getEstatisticasPorMateria() {
    const result = await pool.query(`
      SELECT m.id, m.nome, m.cor,
        COUNT(DISTINCT a.id) as total_assuntos,
        COUNT(DISTINCT q.id) as total_questoes,
        ROUND(AVG(a.frequencia_enem)) as frequencia_media
      FROM materias m
      LEFT JOIN assuntos a ON a.materia_id = m.id
      LEFT JOIN questoes q ON q.materia_id = m.id
      WHERE m.nome != 'Redação'
      GROUP BY m.id
      ORDER BY m.id
    `);
    return result.rows;
  }
}

module.exports = Materia;
