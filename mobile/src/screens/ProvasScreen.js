import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { provaService } from '../services/api';

export default function ProvasScreen({ navigation }) {
  const [provas, setProvas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarProvas = async () => {
    try {
      const response = await provaService.listar();
      if (response.data.sucesso) {
        setProvas(response.data.dados);
      }
    } catch (error) {
      console.error('Erro ao carregar provas:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarProvas();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'realizada': return 'checkmark-circle';
      case 'agendada': return 'calendar';
      case 'prevista': return 'time';
      default: return 'document';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'realizada': return '#4ECDC4';
      case 'agendada': return '#FFD700';
      case 'prevista': return '#74B9FF';
      default: return '#999';
    }
  };

  const renderProva = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalhesProva', { prova: item })}
    >
      <View style={styles.cardHeader}>
        <Ionicons name={getStatusIcon(item.status)} size={32} color={getStatusColor(item.status)} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>ENEM {item.ano}</Text>
          <Text style={styles.cardSubtitle}>{item.aplicacao}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>
          {new Date(item.data_prova).toLocaleDateString('pt-BR')}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="document-text" size={16} color="#666" />
          <Text style={styles.statText}>{item.total_questoes || 0} questões</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="create" size={16} color="#666" />
          <Text style={styles.statText}>{item.total_redacoes || 0} redações</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={provas}
        renderItem={renderProva}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregarProvas(); }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardDate: { fontSize: 14, color: '#666' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  statText: { fontSize: 12, color: '#666', marginLeft: 4 },
});
