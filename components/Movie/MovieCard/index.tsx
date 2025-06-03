import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MovieCard({ movie, fluxo }: { movie: any; fluxo: string }) {
  const router = useRouter();

  const handlePress = () => {
    if (fluxo === 'series') {
      router.push({
        pathname: '/series/[id]',
        params: { id: movie.objectId },
      });
    } else {
      router.push({
        pathname: '/filmes/[id]',
        params: { id: movie.objectId },
      });
    }
  };

  const getRatingClass = (nota: number) => {
    if (nota >= 8) return styles.ratingGood;
    if (nota >= 5) return styles.ratingOk;
    return styles.ratingBad;
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: movie.posterUrl }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{movie.titulo}</Text>
        <View style={styles.details}>
          <Text style={styles.genre}>{movie.genero}</Text>
          <Text style={[styles.rating, getRatingClass(movie.notaIMDB)]}>
            {movie.notaIMDB}
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={{ color: '#fff', fontWeight: 'bold', margin: 6}} onPress={() => handlePress()}>Ver mais →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0A1F44',
    borderRadius: 10,
    overflow: 'hidden',
    width: 250,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  poster: {
    width: '100%',
    height: 370,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  genre: {
    color: '#ccc',
    fontSize: 14,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    borderRadius: 50,
  },
  ratingGood: { color: 'rgb(148,255,105)' },
  ratingOk: { color: 'rgb(255,209,123)' },
  ratingBad: { color: 'rgb(255,123,123)' },
  link: {
    color: '#2196F3',
    marginTop: 10,
  },
});
