const pool = require('../config/database');

class Prova {
  static async findAll() {
    const result = await pool.query(`
      SELECT p.*, 
        COUNT(DISTINCT q.id) as total_questoes,
        COUNT(DISTINCT r.id) as total_redacoes
      FROM provas p
      LEFT JOIN questoes q ON q.prova_id = p.id
      LEFT JOIN redacoes r ON r.prova_id = p.id
      GROUP BY p.id
      ORDER BY p.ano DESC, p.aplicacao
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT p.*,
        COUNT(DISTINCT q.id) as total_questoes,
        COUNT(DISTINCT r.id) as total_redacoes
      FROM provas p
      LEFT JOIN questoes q ON q.prova_id = p.id
      LEFT JOIN redacoes r ON r.prova_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await pool.query(`
      INSERT INTO provas (ano, aplicacao, tipo, data_prova, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [data.ano, data.aplicacao, data.tipo, data.data_prova, data.status]);
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await pool.query(`
      UPDATE provas 
      SET ano = $1, aplicacao = $2, tipo = $3, data_prova = $4, 
          status = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [data.ano, data.aplicacao, data.tipo, data.data_prova, data.status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM provas WHERE id = $1', [id]);
  }

  static async getQuestoes(provaId) {
    const result = await pool.query(`
      SELECT q.*, m.nome as materia_nome, m.cor as materia_cor,
        a.nome as assunto_nome
      FROM questoes q
      LEFT JOIN materias m ON m.id = q.materia_id
      LEFT JOIN assuntos a ON a.id = q.assunto_id
      WHERE q.prova_id = $1
      ORDER BY q.numero
    `, [provaId]);
    return result.rows;
  }
}

module.exports = Prova;
