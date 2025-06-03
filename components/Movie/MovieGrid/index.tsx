// components/MovieGrid.tsx
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MovieCard from '../MovieCard';

export default function MovieGrid({ movies, fluxo }: { movies: any[], fluxo: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovies = movies.filter((movie) =>
    movie.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          placeholder="Buscar filmes ou séries..."
          placeholderTextColor="#aaa"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.input}
        />
      </View>

      <FlatList
        data={filteredMovies}
        horizontal
        keyExtractor={(item) => item.objectId.toString()}
        renderItem={({ item }) => <MovieCard movie={item} fluxo={fluxo} />}
        contentContainerStyle={styles.grid}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  grid: {
    alignItems: 'center',
    gap: 40,
  },
});
