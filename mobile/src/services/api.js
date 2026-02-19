import axios from 'axios';

// Configure o IP da sua máquina local aqui
// Para Android Emulator use: http://10.0.2.2:3000/api
// Para dispositivo físico use: http://SEU_IP_LOCAL:3000/api
// Para iOS Simulator use: http://localhost:3000/api
const API_BASE_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de requisições
api.interceptors.request.use(
  (config) => {
    console.log(`📡 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logging de respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Serviços de Provas
export const provaService = {
  listar: () => api.get('/provas'),
  obter: (id) => api.get(`/provas/${id}`),
  criar: (data) => api.post('/provas', data),
  atualizar: (id, data) => api.put(`/provas/${id}`, data),
  deletar: (id) => api.delete(`/provas/${id}`),
};

// Serviços de Redações
export const redacaoService = {
  listar: (params) => api.get('/redacoes', { params }),
  obter: (id) => api.get(`/redacoes/${id}`),
  criar: (data) => api.post('/redacoes', data),
  analisar: (id) => api.post(`/redacoes/${id}/analisar`),
  atualizar: (id, data) => api.put(`/redacoes/${id}`, data),
  deletar: (id) => api.delete(`/redacoes/${id}`),
  estatisticas: () => api.get('/redacoes/estatisticas'),
};

// Serviços de Matérias
export const materiaService = {
  listar: () => api.get('/materias'),
  obter: (id) => api.get(`/materias/${id}`),
  assuntosMaisCobrados: (limit = 20) => api.get(`/materias/assuntos/mais-cobrados?limit=${limit}`),
  estatisticas: () => api.get('/materias/estatisticas'),
};

// Serviços de Questões
export const questaoService = {
  listar: (params) => api.get('/questoes', { params }),
  obter: (id) => api.get(`/questoes/${id}`),
  criar: (data) => api.post('/questoes', data),
  verificarResposta: (id, resposta) => api.post(`/questoes/${id}/verificar`, { resposta }),
  atualizar: (id, data) => api.put(`/questoes/${id}`, data),
  deletar: (id) => api.delete(`/questoes/${id}`),
};

export default api;
