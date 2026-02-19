import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { redacaoService } from '../services/api';

export default function DetalhesRedacaoScreen({ route, navigation }) {
  const [redacao, setRedacao] = useState(route.params.redacao);
  const [analisando, setAnalisando] = useState(false);

  const handleAnalisar = async () => {
    try {
      setAnalisando(true);
      const response = await redacaoService.analisar(redacao.id);
      
      if (response.data.sucesso) {
        setRedacao(response.data.dados);
        Alert.alert('Sucesso! 🎉', 'Redação analisada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao analisar redação:', error);
      Alert.alert('Erro', 'Não foi possível analisar a redação');
    } finally {
      setAnalisando(false);
    }
  };

  const CompetenciaCard = ({ numero, nota, max = 200 }) => (
    <View style={styles.competenciaCard}>
      <Text style={styles.competenciaLabel}>Competência {numero}</Text>
      <View style={styles.notaBox}>
        <Text style={styles.notaValor}>{nota || '-'}</Text>
        <Text style={styles.notaMax}>/{max}</Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((nota || 0) / max) * 100}%` },
          ]}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{redacao.titulo}</Text>
        <Text style={styles.tema}>{redacao.tema}</Text>
        {redacao.nota_total && (
          <View style={styles.notaTotalBox}>
            <Ionicons name="trophy" size={32} color="#FFD700" />
            <Text style={styles.notaTotalLabel}>Nota Final</Text>
            <Text style={styles.notaTotalValor}>{redacao.nota_total}</Text>
            <Text style={styles.notaTotalMax}>/1000</Text>
          </View>
        )}
      </View>

      {redacao.status === 'aguardando' && (
        <View style={styles.analyzeBox}>
          <Text style={styles.analyzeText}>
            Esta redação ainda não foi analisada
          </Text>
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalisar}
            disabled={analisando}
          >
            {analisando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="analytics" size={20} color="#fff" />
                <Text style={styles.analyzeButtonText}>Analisar Agora</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {redacao.status === 'analisada' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Competências</Text>
            <View style={styles.competenciasGrid}>
              <CompetenciaCard numero={1} nota={redacao.competencia_1} />
              <CompetenciaCard numero={2} nota={redacao.competencia_2} />
              <CompetenciaCard numero={3} nota={redacao.competencia_3} />
              <CompetenciaCard numero={4} nota={redacao.competencia_4} />
              <CompetenciaCard numero={5} nota={redacao.competencia_5} />
            </View>
          </View>

          {redacao.feedback && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💬 Feedback Geral</Text>
              <Text style={styles.feedbackText}>{redacao.feedback}</Text>
            </View>
          )}

          {redacao.pontos_fortes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✅ Pontos Fortes</Text>
              <Text style={styles.feedbackText}>{redacao.pontos_fortes}</Text>
            </View>
          )}

          {redacao.pontos_melhorar && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📈 Pontos a Melhorar</Text>
              <Text style={styles.feedbackText}>{redacao.pontos_melhorar}</Text>
            </View>
          )}
        </>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Texto da Redação</Text>
        <Text style={styles.textoRedacao}>{redacao.texto}</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  tema: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  notaTotalBox: {
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
  },
  notaTotalLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  notaTotalValor: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  notaTotalMax: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.8,
  },
  analyzeBox: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFEAA7',
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  analyzeButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  competenciasGrid: {
    gap: 12,
  },
  competenciaCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  competenciaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  notaBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  notaValor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  notaMax: {
    fontSize: 16,
    color: '#999',
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  textoRedacao: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
});
