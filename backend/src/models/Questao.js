const pool = require('../config/database');

class Questao {
  static async findAll(filters = {}) {
    let query = `
      SELECT q.*, 
        m.nome as materia_nome, m.cor as materia_cor,
        a.nome as assunto_nome,
        p.ano as prova_ano, p.aplicacao as prova_aplicacao
      FROM questoes q
      LEFT JOIN materias m ON m.id = q.materia_id
      LEFT JOIN assuntos a ON a.id = q.assunto_id
      LEFT JOIN provas p ON p.id = q.prova_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.materia_id) {
      query += ` AND q.materia_id = $${paramCount}`;
      params.push(filters.materia_id);
      paramCount++;
    }

    if (filters.prova_id) {
      query += ` AND q.prova_id = $${paramCount}`;
      params.push(filters.prova_id);
      paramCount++;
    }

    if (filters.nivel_dificuldade) {
      query += ` AND q.nivel_dificuldade = $${paramCount}`;
      params.push(filters.nivel_dificuldade);
      paramCount++;
    }

    query += ' ORDER BY q.prova_id DESC, q.numero';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT q.*, 
        m.nome as materia_nome, m.cor as materia_cor,
        a.nome as assunto_nome,
        p.ano as prova_ano, p.aplicacao as prova_aplicacao
      FROM questoes q
      LEFT JOIN materias m ON m.id = q.materia_id
      LEFT JOIN assuntos a ON a.id = q.assunto_id
      LEFT JOIN provas p ON p.id = q.prova_id
      WHERE q.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await pool.query(`
      INSERT INTO questoes 
        (prova_id, materia_id, assunto_id, numero, enunciado,
         alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e,
         resposta_correta, nivel_dificuldade, tempo_medio_segundos)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      data.prova_id,
      data.materia_id,
      data.assunto_id,
      data.numero,
      data.enunciado,
      data.alternativa_a,
      data.alternativa_b,
      data.alternativa_c,
      data.alternativa_d,
      data.alternativa_e,
      data.resposta_correta,
      data.nivel_dificuldade || 'média',
      data.tempo_medio_segundos || 180
    ]);
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await pool.query(`
      UPDATE questoes 
      SET prova_id = COALESCE($1, prova_id),
          materia_id = COALESCE($2, materia_id),
          assunto_id = COALESCE($3, assunto_id),
          numero = COALESCE($4, numero),
          enunciado = COALESCE($5, enunciado),
          alternativa_a = COALESCE($6, alternativa_a),
          alternativa_b = COALESCE($7, alternativa_b),
          alternativa_c = COALESCE($8, alternativa_c),
          alternativa_d = COALESCE($9, alternativa_d),
          alternativa_e = COALESCE($10, alternativa_e),
          resposta_correta = COALESCE($11, resposta_correta),
          nivel_dificuldade = COALESCE($12, nivel_dificuldade),
          tempo_medio_segundos = COALESCE($13, tempo_medio_segundos)
      WHERE id = $14
      RETURNING *
    `, [
      data.prova_id,
      data.materia_id,
      data.assunto_id,
      data.numero,
      data.enunciado,
      data.alternativa_a,
      data.alternativa_b,
      data.alternativa_c,
      data.alternativa_d,
      data.alternativa_e,
      data.resposta_correta,
      data.nivel_dificuldade,
      data.tempo_medio_segundos,
      id
    ]);
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM questoes WHERE id = $1', [id]);
  }

  static async verificarResposta(id, resposta) {
    const questao = await this.findById(id);
    if (!questao) return null;

    const correta = questao.resposta_correta.toUpperCase() === resposta.toUpperCase();
    
    return {
      questao_id: id,
      resposta_usuario: resposta.toUpperCase(),
      resposta_correta: questao.resposta_correta,
      correta,
      explicacao: correta ? 'Parabéns! Resposta correta.' : `A resposta correta é: ${questao.resposta_correta}`
    };
  }
}

module.exports = Questao;
