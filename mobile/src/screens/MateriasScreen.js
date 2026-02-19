import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { materiaService } from '../services/api';

export default function MateriasScreen() {
  const [materias, setMaterias] = useState([]);
  const [assuntosMaisCobrados, setAssuntosMaisCobrados] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = async () => {
    try {
      const [resMaterias, resAssuntos] = await Promise.all([
        materiaService.listar(),
        materiaService.assuntosMaisCobrados(15),
      ]);
      
      if (resMaterias.data.sucesso) setMaterias(resMaterias.data.dados);
      if (resAssuntos.data.sucesso) setAssuntosMaisCobrados(resAssuntos.data.dados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregarDados(); }} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matérias do ENEM</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Matérias</Text>
        {materias.map((materia) => (
          <View key={materia.id} style={[styles.materiaCard, { borderLeftColor: materia.cor }]}>
            <Text style={styles.materiaNome}>{materia.nome}</Text>
            <Text style={styles.materiaDescricao}>{materia.descricao}</Text>
            <View style={styles.materiaStats}>
              <Text style={styles.materiaStat}>{materia.total_assuntos} assuntos</Text>
              <Text style={styles.materiaStat}>•</Text>
              <Text style={styles.materiaStat}>{materia.total_questoes} questões</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Assuntos Mais Cobrados</Text>
        {assuntosMaisCobrados.map((assunto, index) => (
          <View key={assunto.id} style={styles.assuntoCard}>
            <View style={styles.assuntoRank}>
              <Text style={styles.assuntoRankText}>{index + 1}</Text>
            </View>
            <View style={styles.assuntoInfo}>
              <Text style={styles.assuntoNome}>{assunto.nome}</Text>
              <Text style={styles.assuntoMateria}>{assunto.materia_nome}</Text>
            </View>
            <View style={styles.frequenciaBadge}>
              <Text style={styles.frequenciaText}>{assunto.frequencia_enem}%</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  materiaCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, elevation: 2 },
  materiaNome: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  materiaDescricao: { fontSize: 13, color: '#666', marginBottom: 8 },
  materiaStats: { flexDirection: 'row', gap: 8 },
  materiaStat: { fontSize: 12, color: '#999' },
  assuntoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, elevation: 1 },
  assuntoRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  assuntoRankText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  assuntoInfo: { flex: 1, marginLeft: 12 },
  assuntoNome: { fontSize: 14, fontWeight: '600', color: '#333' },
  assuntoMateria: { fontSize: 12, color: '#666', marginTop: 2 },
  frequenciaBadge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#4ECDC4', borderRadius: 12 },
  frequenciaText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
});
