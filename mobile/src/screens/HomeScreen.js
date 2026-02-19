import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { redacaoService, materiaService } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalRedacoes: 0,
    redacoesAnalisadas: 0,
    mediaGeral: 0,
  });
  const [assuntosMaisCobrados, setAssuntosMaisCobrados] = useState([]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas de redações
      const resStats = await redacaoService.estatisticas();
      if (resStats.data.sucesso) {
        setStats({
          totalRedacoes: resStats.data.dados.total_redacoes || 0,
          redacoesAnalisadas: resStats.data.dados.analisadas || 0,
          mediaGeral: resStats.data.dados.media_geral || 0,
        });
      }

      // Buscar assuntos mais cobrados
      const resAssuntos = await materiaService.assuntosMaisCobrados(5);
      if (resAssuntos.data.sucesso) {
        setAssuntosMaisCobrados(resAssuntos.data.dados);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ENEM Análise 📚</Text>
        <Text style={styles.headerSubtitle}>
          Sistema Completo de Análise de Provas e Redações
        </Text>
        <Text style={styles.headerAuthor}>Criação: @HARRISONCOSTA</Text>
      </View>

      {/* Cards de Resumo */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#4ECDC4' }]}>
          <Ionicons name="document-text" size={32} color="#fff" />
          <Text style={styles.statNumber}>{stats.totalRedacoes}</Text>
          <Text style={styles.statLabel}>Redações Enviadas</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#45B7D1' }]}>
          <Ionicons name="checkmark-circle" size={32} color="#fff" />
          <Text style={styles.statNumber}>{stats.redacoesAnalisadas}</Text>
          <Text style={styles.statLabel}>Analisadas</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#96CEB4' }]}>
          <Ionicons name="star" size={32} color="#fff" />
          <Text style={styles.statNumber}>{stats.mediaGeral}</Text>
          <Text style={styles.statLabel}>Média Geral</Text>
        </View>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
          onPress={() => navigation.navigate('Redações', { screen: 'NovaRedacao' })}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Nova Redação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
          onPress={() => navigation.navigate('Provas')}
        >
          <Ionicons name="list" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Ver Provas do ENEM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FFEAA7' }]}
          onPress={() => navigation.navigate('Matérias')}
        >
          <Ionicons name="book" size={24} color="#333" />
          <Text style={[styles.actionButtonText, { color: '#333' }]}>
            Matérias e Assuntos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Assuntos Mais Cobrados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Top 5 Assuntos Mais Cobrados</Text>
        {assuntosMaisCobrados.map((assunto, index) => (
          <View key={assunto.id} style={styles.assuntoCard}>
            <View style={styles.assuntoRank}>
              <Text style={styles.assuntoRankText}>{index + 1}º</Text>
            </View>
            <View style={styles.assuntoInfo}>
              <Text style={styles.assuntoNome}>{assunto.nome}</Text>
              <Text style={styles.assuntoMateria}>{assunto.materia_nome}</Text>
            </View>
            <View style={styles.assuntoFrequencia}>
              <Text style={styles.assuntoFrequenciaText}>
                {assunto.frequencia_enem}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Informações */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📌 Sobre o ENEM</Text>
        <Text style={styles.infoText}>
          O ENEM é composto por 4 provas objetivas (45 questões cada) e 1 redação:
        </Text>
        <Text style={styles.infoItem}>• Linguagens, Códigos e suas Tecnologias</Text>
        <Text style={styles.infoItem}>• Matemática e suas Tecnologias</Text>
        <Text style={styles.infoItem}>• Ciências Humanas e suas Tecnologias</Text>
        <Text style={styles.infoItem}>• Ciências da Natureza e suas Tecnologias</Text>
        <Text style={styles.infoItem}>• Redação (nota de 0 a 1000)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerAuthor: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginTop: -30,
  },
  statCard: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  assuntoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  assuntoRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assuntoRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  assuntoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  assuntoNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  assuntoMateria: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  assuntoFrequencia: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
  },
  assuntoFrequenciaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoSection: {
    padding: 16,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginBottom: 4,
  },
});
