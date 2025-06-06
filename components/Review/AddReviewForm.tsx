import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const headers = {
  'X-Parse-Application-Id': 'GwnUACA5KJuULzj5Pf30JZhwXU0lkeu43Z1wnDoN',
  'X-Parse-REST-API-Key': '8wYzUlStyJkZFCgAh1aHHy035JPU1e8wNhgRtBqp',
  'Content-Type': 'application/json',
};

async function fetchOMDB(titulo: string) {
  const query = titulo.replaceAll(' ', '+');
  const res = await axios.get(`https://www.omdbapi.com/?t=${query}&apikey=6585022c`);
  return res.data;
}

interface AddReviewFormProps {
  onClose: () => void;
  fluxo: 'filmes' | 'series';
}

export const AddReviewForm: React.FC<AddReviewFormProps> = ({ onClose, fluxo }) => {
  const [titulo, setTitulo] = useState('');
  const [email, setEmail] = useState('');
  const [review, setReview] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ titulo, email, review }: { titulo: string, email: string, review: string }) => {
      const dados = await fetchOMDB(titulo);

      if (fluxo === 'series' && dados?.Type !== 'series') {
        throw new Error('Série não encontrada ou inválida');
      }
      if (fluxo === 'filmes' && dados?.Type !== 'movie') {
        throw new Error('Filme não encontrado ou inválido');
      }

      const payload = {
        titulo: dados.Title,
        genero: dados.Genre,
        duracao: dados.Runtime,
        descricao: dados.Plot,
        diretor: dados.Director,
        pais: dados.Country,
        premios: dados.Awards,
        notaIMDB: parseFloat(dados.imdbRating),
        comentario: review,
        user_email: email,
        posterUrl: dados.Poster,
        ano: parseInt(dados.Year)
      };

      const endpoint = fluxo === 'series'
        ? 'https://parseapi.back4app.com/classes/Series'
        : 'https://parseapi.back4app.com/classes/Filme';

      await axios.post(endpoint, payload, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [fluxo] });
      Alert.alert('Sucesso', `${fluxo === 'series' ? 'Série' : 'Filme'} adicionado com sucesso!`);
      onClose();
    },
    onError: (error: any) => {
      Alert.alert('Erro', `Erro ao adicionar ${fluxo === 'series' ? 'série' : 'filme'}: ${error.message}`);
    }
  });

  const handleSubmit = () => {
    if (!titulo || !email || !review) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    mutation.mutate({ titulo, email, review });
  };

  if (mutation.isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Adicionando review...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Adicionar Novo Review</Text>
          <TextInput
            style={styles.input}
            placeholder={`Título do ${fluxo === 'series' ? 'série' : 'filme'}`}
            placeholderTextColor="#aaa"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={styles.input}
            placeholder="Seu Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Seu Review"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            value={review}
            onChangeText={setReview}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxHeight: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D50000',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFD700',
    fontSize: 26,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#D50000',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 18,
  }
});
