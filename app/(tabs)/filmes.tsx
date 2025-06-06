import { AddReviewForm } from '@/components/Review/AddReviewForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MovieGrid from '../../components/Movie/MovieGrid';

const headers = {
  'X-Parse-Application-Id': 'GwnUACA5KJuULzj5Pf30JZhwXU0lkeu43Z1wnDoN',
  'X-Parse-REST-API-Key': '8wYzUlStyJkZFCgAh1aHHy035JPU1e8wNhgRtBqp',
  'Content-Type': 'application/json',
};

async function fetchFilmes() {
  const res = await axios.get('https://parseapi.back4app.com/classes/Filme', { headers });
  return res.data.results;
}

export default function Filmes() {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['filmes'],
    queryFn: fetchFilmes,
  });

  if (isLoading) return <ActivityIndicator size="large" color="#e50914" />;
  if (error) return <Text>Erro ao carregar filmes.</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', paddingTop: 50, alignItems: 'center' }}>
      <Text style={styles.title}>Reviews de Filmes</Text>

      <TouchableOpacity style={styles.btnPrimary} onPress={() => setModalVisible(true)}>
        <Text style={styles.text}>Adicionar review</Text>
      </TouchableOpacity>

      <MovieGrid movies={data} fluxo="filmes" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <AddReviewForm onClose={() => setModalVisible(false)} fluxo="filmes" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#FFD700',
    fontSize: 45,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 20
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700'
  },
  btnPrimary: {
    backgroundColor: '#D50000',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 0
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
