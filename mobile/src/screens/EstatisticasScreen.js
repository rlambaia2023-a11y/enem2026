import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { redacaoService, materiaService } from '../services/api';

export default function EstatisticasScreen() {
  const [statsRedacoes, setStatsRedacoes] = useState(null);
  const [statsMaterias, setStatsMaterias] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarEstatisticas = async () => {
    try {
      const [resRedacoes, resMaterias] = await Promise.all([
        redacaoService.estatisticas(),
        materiaService.estatisticas(),
      ]);
      
      if (resRedacoes.data.sucesso) setStatsRedacoes(resRedacoes.data.dados);
      if (resMaterias.data.sucesso) setStatsMaterias(resMaterias.data.dados);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregarEstatisticas(); }} />}
    >
      <View style={styles.header}>
        <Ionicons name="stats-chart" size={48} color="#fff" />
        <Text style={styles.headerTitle}>Estatísticas</Text>
      </View>

      {statsRedacoes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Redações</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{statsRedacoes.total_redacoes || 0}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{statsRedacoes.analisadas || 0}</Text>
              <Text style={styles.statLabel}>Analisadas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{statsRedacoes.media_geral || 0}</Text>
              <Text style={styles.statLabel}>Média</Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Média por Competência</Text>
          {[1, 2, 3, 4, 5].map((num) => (
            <View key={num} style={styles.competenciaRow}>
              <Text style={styles.competenciaLabel}>Competência {num}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(statsRedacoes[`media_comp${num}`] || 0) / 2}%` }]} />
              </View>
              <Text style={styles.competenciaValue}>{statsRedacoes[`media_comp${num}`] || 0}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Matérias</Text>
        {statsMaterias.map((materia) => (
          <View key={materia.id} style={styles.materiaRow}>
            <View style={[styles.materiaColor, { backgroundColor: materia.cor }]} />
            <View style={styles.materiaInfo}>
              <Text style={styles.materiaNome}>{materia.nome}</Text>
              <Text style={styles.materiaStats}>
                {materia.total_assuntos} assuntos • {materia.total_questoes} questões
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', padding: 32, paddingTop: 60, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  section: { margin: 16, padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  subsectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 12, color: '#333' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statBox: { alignItems: 'center', padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8, flex: 1, margin: 4 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  competenciaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  competenciaLabel: { width: 120, fontSize: 13, color: '#666' },
  progressBar: { flex: 1, height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginHorizontal: 8 },
  progressFill: { height: '100%', backgroundColor: '#4ECDC4', borderRadius: 4 },
  competenciaValue: { width: 40, fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'right' },
  materiaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  materiaColor: { width: 4, height: 40, borderRadius: 2, marginRight: 12 },
  materiaInfo: { flex: 1 },
  materiaNome: { fontSize: 15, fontWeight: '600', color: '#333' },
  materiaStats: { fontSize: 12, color: '#666', marginTop: 2 },
});
