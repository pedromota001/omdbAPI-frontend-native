import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Copie as headers e a função fetchOMDB do seu arquivo filmes.tsx
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
  onClose: () => void; // Função para fechar o modal
}

export const AddReviewForm: React.FC<AddReviewFormProps> = ({ onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [email, setEmail] = useState('');
  const [review, setReview] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ titulo, email, review }: { titulo: string, email: string, review: string }) => {
      const filme = await fetchOMDB(titulo);
      if (filme?.Type !== 'movie') throw new Error('Filme não encontrado ou não é um filme');

      await axios.post('https://parseapi.back4app.com/classes/Filme', {
        titulo: filme.Title,
        genero: filme.Genre,
        duracao: filme.Runtime,
        descricao: filme.Plot,
        diretor: filme.Director,
        pais: filme.Country,
        premios: filme.Awards,
        notaIMDB: parseFloat(filme.imdbRating), // Use parseFloat para notas decimais
        comentario: review,
        user_email: email,
        posterUrl: filme.Poster,
        ano: parseInt(filme.Year)
      }, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filmes'] }); 
      queryClient.invalidateQueries({ queryKey: ['series'] }); // Invalida a query de filmes para atualizar a lista
      Alert.alert('Sucesso', 'Filme adicionado com sucesso!');
      onClose(); // Fecha o modal ao adicionar com sucesso
    },
    onError: (error: any) => { // Tipagem do erro para acessar a propriedade 'message'
      Alert.alert('Erro', `Erro ao adicionar filme: ${error.message || 'Verifique o título do filme.'}`);
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
        placeholder="Título do Filme"
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
    backgroundColor: '#1e1e1e', // Cor de fundo do modal
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxHeight: '90%', // Limita a altura do modal
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