import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DetalhesProvaScreen({ route }) {
  const { prova } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={48} color="#fff" />
        <Text style={styles.title}>ENEM {prova.ano}</Text>
        <Text style={styles.subtitle}>{prova.aplicacao}</Text>
        <Text style={styles.date}>{new Date(prova.data_prova).toLocaleDateString('pt-BR')}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Estatísticas</Text>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={24} color="#007AFF" />
          <Text style={styles.statValue}>{prova.total_questoes || 0}</Text>
          <Text style={styles.statLabel}>Questões Cadastradas</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="create" size={24} color="#FF6B6B" />
          <Text style={styles.statValue}>{prova.total_redacoes || 0}</Text>
          <Text style={styles.statLabel}>Redações Enviadas</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Informações</Text>
        <Text style={styles.infoText}>Tipo: {prova.tipo}</Text>
        <Text style={styles.infoText}>Status: {prova.status}</Text>
        <Text style={styles.infoText}>Ano: {prova.ano}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', padding: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  subtitle: { fontSize: 16, color: '#fff', marginTop: 4 },
  date: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 8 },
  section: { margin: 16, padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  statCard: { alignItems: 'center', padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8, marginBottom: 12 },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#333', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#666', marginTop: 4 },
  infoText: { fontSize: 14, color: '#666', marginBottom: 8 },
});
