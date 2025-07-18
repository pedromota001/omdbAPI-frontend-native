import { AddReviewForm } from '@/components/Review/AddReviewForm'; // Sua importação com alias
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Removido useMutation daqui, pois agora está no AddReviewForm
import axios from 'axios';
import { useState } from 'react'; // Importe useState
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Importe Modal
import MovieGrid from '../../components/Movie/MovieGrid';

const headers = {
  'X-Parse-Application-Id': 'GwnUACA5KJuULzj5Pf30JZhwXU0lkeu43Z1wnDoN',
  'X-Parse-REST-API-Key': '8wYzUlStyJkZFCgAh1aHHy035JPU1e8wNhgRtBqp',
  'Content-Type': 'application/json',
};

async function fetchSeries() {
  const res = await axios.get('https://parseapi.back4app.com/classes/Series', { headers });
  return res.data.results;
}

async function fetchOMDB(titulo: string) {
  const query = titulo.replaceAll(' ', '+');
  const res = await axios.get(`https://www.omdbapi.com/?t=${query}&apikey=6585022c`);
  return res.data;
}

export default function Series() {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal

  const { data, isLoading, error } = useQuery({
    queryKey: ['series'],
    queryFn: fetchSeries,
  });

  if (isLoading) return <ActivityIndicator size="large" color="#e50914" />;
  if (error) return <Text>Erro ao carregar séries.</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', paddingTop: 50, alignItems: 'center'}}>
      <Text style={styles.title}>Reviews de séries</Text>

      <TouchableOpacity style={styles.btnPrimary} onPress={() => setModalVisible(true)}>
        <Text style={styles.text}>Adicionar review</Text>
      </TouchableOpacity>
      <MovieGrid movies={data} fluxo="series" />

      <Modal
        animationType="slide" 
        transparent={true} 
        visible={modalVisible}
        onRequestClose={() => { 
          setModalVisible(false); 
        }}
      >
        <View style={styles.centeredView}>
          <AddReviewForm onClose={() => setModalVisible(false)} fluxo="series" />
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
  // Novos estilos para o modal overlay
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});