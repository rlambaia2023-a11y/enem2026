import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { redacaoService } from '../services/api';

export default function RedacoesScreen({ navigation }) {
  const [redacoes, setRedacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarRedacoes = async () => {
    try {
      setLoading(true);
      const response = await redacaoService.listar();
      if (response.data.sucesso) {
        setRedacoes(response.data.dados);
      }
    } catch (error) {
      console.error('Erro ao carregar redações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as redações');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarRedacoes();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarRedacoes();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'analisada':
        return '#4ECDC4';
      case 'aguardando':
        return '#FFEAA7';
      case 'em_analise':
        return '#74B9FF';
      default:
        return '#DFE6E9';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'analisada':
        return 'Analisada';
      case 'aguardando':
        return 'Aguardando';
      case 'em_analise':
        return 'Em Análise';
      default:
        return status;
    }
  };

  const renderRedacao = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalhesRedacao', { redacao: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.titulo}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.cardTema} numberOfLines={2}>
        {item.tema}
      </Text>

      {item.nota_total !== null && (
        <View style={styles.notaContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.notaText}>Nota: {item.nota_total}/1000</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>
          {new Date(item.created_at).toLocaleDateString('pt-BR')}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={80} color="#DFE6E9" />
      <Text style={styles.emptyText}>Nenhuma redação encontrada</Text>
      <Text style={styles.emptySubtext}>
        Comece enviando sua primeira redação!
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('NovaRedacao')}
      >
        <Text style={styles.emptyButtonText}>Criar Nova Redação</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={redacoes}
        renderItem={renderRedacao}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading && renderEmpty}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovaRedacao')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  cardTema: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  notaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
