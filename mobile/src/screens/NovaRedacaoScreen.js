import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { redacaoService, provaService } from '../services/api';

export default function NovaRedacaoScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [provas, setProvas] = useState([]);

  useEffect(() => {
    carregarProvas();
  }, []);

  const carregarProvas = async () => {
    try {
      const response = await provaService.listar();
      if (response.data.sucesso) {
        setProvas(response.data.dados);
      }
    } catch (error) {
      console.error('Erro ao carregar provas:', error);
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Por favor, informe um título para a redação');
      return;
    }

    if (!tema.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o tema da redação');
      return;
    }

    if (!texto.trim() || texto.trim().length < 100) {
      Alert.alert(
        'Atenção',
        'A redação deve conter pelo menos 100 caracteres'
      );
      return;
    }

    try {
      setLoading(true);
      const response = await redacaoService.criar({
        titulo,
        tema,
        texto,
      });

      if (response.data.sucesso) {
        Alert.alert(
          'Sucesso! 🎉',
          'Sua redação foi enviada e está aguardando análise.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao criar redação:', error);
      Alert.alert('Erro', 'Não foi possível enviar a redação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            Escreva sua redação seguindo o modelo dissertativo-argumentativo do ENEM
          </Text>
        </View>

        <Text style={styles.label}>Título da Redação</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Minha redação sobre..."
          value={titulo}
          onChangeText={setTitulo}
          maxLength={200}
        />

        <Text style={styles.label}>Tema</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Informe o tema da redação"
          value={tema}
          onChangeText={setTema}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Texto da Redação</Text>
        <Text style={styles.charCount}>{texto.length} caracteres</Text>
        <TextInput
          style={[styles.input, styles.textArea, styles.mainTextArea]}
          placeholder="Digite o texto completo da sua redação aqui..."
          value={texto}
          onChangeText={setTexto}
          multiline
          numberOfLines={20}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Enviar para Análise</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#1976D2',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
  },
  mainTextArea: {
    minHeight: 300,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});
