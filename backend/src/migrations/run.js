const pool = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando migração do banco de dados...');

    // Tabela de matérias do ENEM
    await client.query(`
      CREATE TABLE IF NOT EXISTS materias (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        descricao TEXT,
        cor VARCHAR(7) DEFAULT '#007AFF',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela materias criada');

    // Tabela de assuntos por matéria
    await client.query(`
      CREATE TABLE IF NOT EXISTS assuntos (
        id SERIAL PRIMARY KEY,
        materia_id INTEGER REFERENCES materias(id) ON DELETE CASCADE,
        nome VARCHAR(200) NOT NULL,
        frequencia_enem INTEGER DEFAULT 0,
        dificuldade VARCHAR(20) DEFAULT 'média',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela assuntos criada');

    // Tabela de provas
    await client.query(`
      CREATE TABLE IF NOT EXISTS provas (
        id SERIAL PRIMARY KEY,
        ano INTEGER NOT NULL,
        aplicacao VARCHAR(50),
        tipo VARCHAR(50) DEFAULT 'ENEM',
        data_prova DATE,
        status VARCHAR(20) DEFAULT 'realizada',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela provas criada');

    // Tabela de questões
    await client.query(`
      CREATE TABLE IF NOT EXISTS questoes (
        id SERIAL PRIMARY KEY,
        prova_id INTEGER REFERENCES provas(id) ON DELETE CASCADE,
        materia_id INTEGER REFERENCES materias(id),
        assunto_id INTEGER REFERENCES assuntos(id),
        numero INTEGER NOT NULL,
        enunciado TEXT NOT NULL,
        alternativa_a TEXT,
        alternativa_b TEXT,
        alternativa_c TEXT,
        alternativa_d TEXT,
        alternativa_e TEXT,
        resposta_correta VARCHAR(1) NOT NULL,
        nivel_dificuldade VARCHAR(20) DEFAULT 'média',
        tempo_medio_segundos INTEGER DEFAULT 180,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela questoes criada');

    // Tabela de redações submetidas
    await client.query(`
      CREATE TABLE IF NOT EXISTS redacoes (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        tema TEXT NOT NULL,
        texto TEXT NOT NULL,
        prova_id INTEGER REFERENCES provas(id),
        competencia_1 INTEGER CHECK (competencia_1 >= 0 AND competencia_1 <= 200),
        competencia_2 INTEGER CHECK (competencia_2 >= 0 AND competencia_2 <= 200),
        competencia_3 INTEGER CHECK (competencia_3 >= 0 AND competencia_3 <= 200),
        competencia_4 INTEGER CHECK (competencia_4 >= 0 AND competencia_4 <= 200),
        competencia_5 INTEGER CHECK (competencia_5 >= 0 AND competencia_5 <= 200),
        nota_total INTEGER,
        feedback TEXT,
        pontos_fortes TEXT,
        pontos_melhorar TEXT,
        status VARCHAR(20) DEFAULT 'em_analise',
        analisada_em TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela redacoes criada');

    // Tabela de simulados realizados
    await client.query(`
      CREATE TABLE IF NOT EXISTS simulados (
        id SERIAL PRIMARY KEY,
        prova_id INTEGER REFERENCES provas(id),
        usuario_nome VARCHAR(100),
        data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_fim TIMESTAMP,
        tempo_total_segundos INTEGER,
        status VARCHAR(20) DEFAULT 'em_andamento',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela simulados criada');

    // Tabela de respostas do simulado
    await client.query(`
      CREATE TABLE IF NOT EXISTS respostas_simulado (
        id SERIAL PRIMARY KEY,
        simulado_id INTEGER REFERENCES simulados(id) ON DELETE CASCADE,
        questao_id INTEGER REFERENCES questoes(id),
        resposta_usuario VARCHAR(1),
        correta BOOLEAN,
        tempo_resposta_segundos INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela respostas_simulado criada');

    // Tabela de estatísticas
    await client.query(`
      CREATE TABLE IF NOT EXISTS estatisticas (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        chave VARCHAR(100) NOT NULL,
        valor TEXT,
        metadados JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tipo, chave)
      );
    `);
    console.log('✅ Tabela estatisticas criada');

    console.log('🎉 Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    throw error;
  } finally {
    client.release();
  }
};

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Inserindo dados iniciais...');

    // Verificar se já existem dados
    const checkMaterias = await client.query('SELECT COUNT(*) FROM materias');
    if (parseInt(checkMaterias.rows[0].count) > 0) {
      console.log('ℹ️  Dados já existem, pulando seed');
      return;
    }

    // Inserir matérias do ENEM
    const materias = [
      { nome: 'Linguagens e Códigos', descricao: 'Língua Portuguesa, Literatura, Língua Estrangeira, Artes, Educação Física e Tecnologias', cor: '#FF6B6B' },
      { nome: 'Matemática', descricao: 'Matemática e suas Tecnologias', cor: '#4ECDC4' },
      { nome: 'Ciências Humanas', descricao: 'História, Geografia, Filosofia e Sociologia', cor: '#45B7D1' },
      { nome: 'Ciências da Natureza', descricao: 'Física, Química e Biologia', cor: '#96CEB4' },
      { nome: 'Redação', descricao: 'Produção de texto dissertativo-argumentativo', cor: '#FFEAA7' }
    ];

    for (const materia of materias) {
      await client.query(
        'INSERT INTO materias (nome, descricao, cor) VALUES ($1, $2, $3)',
        [materia.nome, materia.descricao, materia.cor]
      );
    }
    console.log('✅ Matérias inseridas');

    // Inserir assuntos mais cobrados (Top 10 por matéria)
    const assuntos = [
      // Linguagens e Códigos
      { materia: 1, nome: 'Interpretação de textos', frequencia: 95, dificuldade: 'alta' },
      { materia: 1, nome: 'Figuras de linguagem', frequencia: 85, dificuldade: 'média' },
      { materia: 1, nome: 'Funções da linguagem', frequencia: 80, dificuldade: 'média' },
      { materia: 1, nome: 'Variação linguística', frequencia: 75, dificuldade: 'média' },
      { materia: 1, nome: 'Gêneros textuais', frequencia: 90, dificuldade: 'alta' },
      { materia: 1, nome: 'Literatura Brasileira', frequencia: 70, dificuldade: 'média' },
      { materia: 1, nome: 'Gramática (sintaxe)', frequencia: 65, dificuldade: 'alta' },
      { materia: 1, nome: 'Intertextualidade', frequencia: 60, dificuldade: 'média' },
      { materia: 1, nome: 'Semântica', frequencia: 55, dificuldade: 'média' },
      { materia: 1, nome: 'Modernismo', frequencia: 50, dificuldade: 'média' },
      
      // Matemática
      { materia: 2, nome: 'Porcentagem', frequencia: 90, dificuldade: 'média' },
      { materia: 2, nome: 'Razão e Proporção', frequencia: 85, dificuldade: 'média' },
      { materia: 2, nome: 'Geometria Plana', frequencia: 88, dificuldade: 'alta' },
      { materia: 2, nome: 'Funções', frequencia: 92, dificuldade: 'alta' },
      { materia: 2, nome: 'Probabilidade', frequencia: 80, dificuldade: 'média' },
      { materia: 2, nome: 'Estatística', frequencia: 82, dificuldade: 'média' },
      { materia: 2, nome: 'Geometria Espacial', frequencia: 75, dificuldade: 'alta' },
      { materia: 2, nome: 'Equações de 1º e 2º grau', frequencia: 70, dificuldade: 'média' },
      { materia: 2, nome: 'Análise de gráficos', frequencia: 85, dificuldade: 'média' },
      { materia: 2, nome: 'Trigonometria', frequencia: 65, dificuldade: 'alta' },
      
      // Ciências Humanas
      { materia: 3, nome: 'Brasil Colônia', frequencia: 75, dificuldade: 'média' },
      { materia: 3, nome: 'Era Vargas', frequencia: 70, dificuldade: 'média' },
      { materia: 3, nome: 'Ditadura Militar', frequencia: 80, dificuldade: 'média' },
      { materia: 3, nome: 'Escravidão no Brasil', frequencia: 85, dificuldade: 'média' },
      { materia: 3, nome: 'Geopolítica Mundial', frequencia: 78, dificuldade: 'alta' },
      { materia: 3, nome: 'Urbanização', frequencia: 82, dificuldade: 'média' },
      { materia: 3, nome: 'Movimentos Sociais', frequencia: 88, dificuldade: 'alta' },
      { materia: 3, nome: 'Meio Ambiente', frequencia: 90, dificuldade: 'média' },
      { materia: 3, nome: 'Filosofia Moderna', frequencia: 65, dificuldade: 'alta' },
      { materia: 3, nome: 'Sociologia Contemporânea', frequencia: 72, dificuldade: 'alta' },
      
      // Ciências da Natureza
      { materia: 4, nome: 'Mecânica', frequencia: 85, dificuldade: 'alta' },
      { materia: 4, nome: 'Eletricidade', frequencia: 80, dificuldade: 'alta' },
      { materia: 4, nome: 'Química Orgânica', frequencia: 88, dificuldade: 'alta' },
      { materia: 4, nome: 'Estequiometria', frequencia: 82, dificuldade: 'alta' },
      { materia: 4, nome: 'Ecologia', frequencia: 90, dificuldade: 'média' },
      { materia: 4, nome: 'Genética', frequencia: 85, dificuldade: 'alta' },
      { materia: 4, nome: 'Citologia', frequencia: 78, dificuldade: 'média' },
      { materia: 4, nome: 'Termodinâmica', frequencia: 70, dificuldade: 'alta' },
      { materia: 4, nome: 'Reações Químicas', frequencia: 75, dificuldade: 'média' },
      { materia: 4, nome: 'Evolução', frequencia: 72, dificuldade: 'média' }
    ];

    for (const assunto of assuntos) {
      await client.query(
        'INSERT INTO assuntos (materia_id, nome, frequencia_enem, dificuldade) VALUES ($1, $2, $3, $4)',
        [assunto.materia, assunto.nome, assunto.frequencia, assunto.dificuldade]
      );
    }
    console.log('✅ Assuntos inseridos');

    // Inserir provas históricas e futuras
    const provas = [
      { ano: 2023, aplicacao: '1ª Aplicação', tipo: 'ENEM', data: '2023-11-05', status: 'realizada' },
      { ano: 2023, aplicacao: '2ª Aplicação', tipo: 'ENEM', data: '2023-11-12', status: 'realizada' },
      { ano: 2024, aplicacao: '1ª Aplicação', tipo: 'ENEM', data: '2024-11-03', status: 'realizada' },
      { ano: 2024, aplicacao: '2ª Aplicação', tipo: 'ENEM', data: '2024-11-10', status: 'realizada' },
      { ano: 2025, aplicacao: '1ª Aplicação', tipo: 'ENEM', data: '2025-11-02', status: 'agendada' },
      { ano: 2025, aplicacao: '2ª Aplicação', tipo: 'ENEM', data: '2025-11-09', status: 'agendada' },
      { ano: 2026, aplicacao: '1ª Aplicação', tipo: 'ENEM', data: '2026-11-01', status: 'prevista' },
    ];

    for (const prova of provas) {
      await client.query(
        'INSERT INTO provas (ano, aplicacao, tipo, data_prova, status) VALUES ($1, $2, $3, $4, $5)',
        [prova.ano, prova.aplicacao, prova.tipo, prova.data, prova.status]
      );
    }
    console.log('✅ Provas inseridas');

    // Inserir exemplo de redação
    await client.query(`
      INSERT INTO redacoes (titulo, tema, texto, prova_id, status) 
      VALUES (
        'Exemplo de Redação', 
        'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
        'A Constituição Federal de 1988 assegura direitos fundamentais a todos os cidadãos brasileiros, incluindo o reconhecimento e proteção das comunidades tradicionais. No entanto, observa-se que tais direitos não são plenamente efetivados, uma vez que esses grupos continuam enfrentando desafios significativos. Nesse contexto, é fundamental analisar os obstáculos para a valorização desses povos e propor soluções efetivas.\n\nEm primeiro lugar, destaca-se o preconceito cultural como uma barreira importante. Muitas vezes, as práticas e conhecimentos tradicionais são desvalorizados pela sociedade, que tende a privilegiar o modelo de vida urbano e moderno. Essa discriminação dificulta não apenas o reconhecimento social, mas também o acesso a políticas públicas específicas...',
        1,
        'aguardando'
      )
    `);
    console.log('✅ Redação exemplo inserida');

    console.log('🎉 Seed concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  } finally {
    client.release();
  }
};

const main = async () => {
  try {
    await createTables();
    await seedData();
    console.log('✨ Banco de dados configurado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  }
};

main();
