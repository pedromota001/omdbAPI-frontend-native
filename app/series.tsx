// app/filmes.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import MovieGrid from '../components/Movie/MovieGrid';


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

  const { data, isLoading, error } = useQuery({
    queryKey: ['series'],
    queryFn: fetchSeries,
  });

  const mutation = useMutation({
    mutationFn: async ({ titulo, email, review }: { titulo: string, email: string, review: string }) => {
      const filme = await fetchOMDB(titulo);
      if (filme?.Type !== 'movie') throw new Error('Filme não encontrado');

      await axios.post('https://parseapi.back4app.com/classes/Filme', {
        titulo: filme.Title,
        genero: filme.Genre,
        duracao: filme.Runtime,
        descricao: filme.Plot,
        diretor: filme.Director,
        pais: filme.Country,
        premios: filme.Awards,
        notaIMDB: parseInt(filme.imdbRating),
        comentario: review,
        user_email: email,
        posterUrl: filme.Poster,
        ano: parseInt(filme.Year)
      }, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filmes'] });
      Alert.alert('Sucesso', 'Filme adicionado com sucesso!');
    },
    onError: () => {
      Alert.alert('Erro', 'Erro ao adicionar filme.');
    }
  });

  if (isLoading) return <ActivityIndicator size="large" color="#e50914" />;
  if (error) return <Text>Erro ao carregar séries.</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', paddingTop: 50 }}>
      <Text style={styles.title}>Reviews de séries</Text>
      <MovieGrid movies={data} fluxo="series" />
    </View>
  );
}

const styles = StyleSheet.create({
   title: {
    color: '#FFD700',
    fontSize: 45,
    textAlign: 'center',
    fontWeight: 700,
    marginTop: 20
  }
});
