const pool = require('../config/database');

class Redacao {
  static async findAll(filters = {}) {
    let query = `
      SELECT r.*, p.ano, p.aplicacao, p.tipo as tipo_prova
      FROM redacoes r
      LEFT JOIN provas p ON p.id = r.prova_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND r.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.prova_id) {
      query += ` AND r.prova_id = $${paramCount}`;
      params.push(filters.prova_id);
      paramCount++;
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT r.*, p.ano, p.aplicacao, p.tipo as tipo_prova
      FROM redacoes r
      LEFT JOIN provas p ON p.id = r.prova_id
      WHERE r.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await pool.query(`
      INSERT INTO redacoes 
        (titulo, tema, texto, prova_id, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      data.titulo,
      data.tema,
      data.texto,
      data.prova_id || null,
      'aguardando'
    ]);
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await pool.query(`
      UPDATE redacoes 
      SET titulo = COALESCE($1, titulo),
          tema = COALESCE($2, tema),
          texto = COALESCE($3, texto),
          prova_id = COALESCE($4, prova_id),
          competencia_1 = COALESCE($5, competencia_1),
          competencia_2 = COALESCE($6, competencia_2),
          competencia_3 = COALESCE($7, competencia_3),
          competencia_4 = COALESCE($8, competencia_4),
          competencia_5 = COALESCE($9, competencia_5),
          nota_total = COALESCE($10, nota_total),
          feedback = COALESCE($11, feedback),
          pontos_fortes = COALESCE($12, pontos_fortes),
          pontos_melhorar = COALESCE($13, pontos_melhorar),
          status = COALESCE($14, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *
    `, [
      data.titulo,
      data.tema,
      data.texto,
      data.prova_id,
      data.competencia_1,
      data.competencia_2,
      data.competencia_3,
      data.competencia_4,
      data.competencia_5,
      data.nota_total,
      data.feedback,
      data.pontos_fortes,
      data.pontos_melhorar,
      data.status,
      id
    ]);
    return result.rows[0];
  }

  static async analisar(id) {
    // Simulação de análise automática das competências
    const competencias = {
      competencia_1: Math.floor(Math.random() * 41) + 160, // 160-200
      competencia_2: Math.floor(Math.random() * 41) + 160,
      competencia_3: Math.floor(Math.random() * 41) + 160,
      competencia_4: Math.floor(Math.random() * 41) + 160,
      competencia_5: Math.floor(Math.random() * 41) + 160,
    };

    const nota_total = Object.values(competencias).reduce((a, b) => a + b, 0);

    const result = await pool.query(`
      UPDATE redacoes 
      SET competencia_1 = $1,
          competencia_2 = $2,
          competencia_3 = $3,
          competencia_4 = $4,
          competencia_5 = $5,
          nota_total = $6,
          feedback = $7,
          pontos_fortes = $8,
          pontos_melhorar = $9,
          status = 'analisada',
          analisada_em = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [
      competencias.competencia_1,
      competencias.competencia_2,
      competencias.competencia_3,
      competencias.competencia_4,
      competencias.competencia_5,
      nota_total,
      'Sua redação demonstra bom domínio da norma culta e apresenta argumentação consistente. Continue aprimorando a proposta de intervenção.',
      '• Boa estrutura dissertativa\n• Argumentos bem fundamentados\n• Uso adequado de conectivos\n• Repertório sociocultural presente',
      '• Desenvolver melhor a proposta de intervenção\n• Incluir mais dados e estatísticas\n• Aprofundar a análise crítica\n• Evitar repetições de palavras',
      id
    ]);

    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM redacoes WHERE id = $1', [id]);
  }

  static async getEstatisticas() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_redacoes,
        COUNT(*) FILTER (WHERE status = 'analisada') as analisadas,
        COUNT(*) FILTER (WHERE status = 'aguardando') as aguardando,
        ROUND(AVG(nota_total)) as media_geral,
        ROUND(AVG(competencia_1)) as media_comp1,
        ROUND(AVG(competencia_2)) as media_comp2,
        ROUND(AVG(competencia_3)) as media_comp3,
        ROUND(AVG(competencia_4)) as media_comp4,
        ROUND(AVG(competencia_5)) as media_comp5,
        MAX(nota_total) as nota_maxima,
        MIN(nota_total) as nota_minima
      FROM redacoes
      WHERE status = 'analisada'
    `);
    return result.rows[0];
  }
}

module.exports = Redacao;
