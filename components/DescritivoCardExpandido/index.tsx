import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DescritivoCardExpandido({ object }: { object: any }) {
  const informacoesBasicas = `${object.ano} - ${object.genero} - ${object.duracao}`;

  const getRatingColor = () => {
    if (object.notaIMDB < 7) return '#E61D41';
    if (object.notaIMDB < 8.5) return '#f5c518';
    return '#22c55e';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Text style={styles.title}>{object.titulo}</Text>
        <Text style={styles.basicInfo}>{informacoesBasicas}</Text>
        <Text style={styles.director}>
          {object.diretor === 'N/A' ? 'Diretor desconhecido' : object.diretor}
        </Text>
        <Text style={[styles.rating, { backgroundColor: getRatingColor() }]}>
          {object.notaIMDB}
        </Text>

        <View style={styles.synopsisContainer}>
          <Text style={styles.description}>{object.descricao}</Text>
          <Text style={styles.extraInfo}>País: {object.pais}</Text>
          <Text style={styles.extraInfo}>Prêmios: {object.premios}</Text>
        </View>

        <Text style={styles.reviewEmail}>Review: {object.user_email}</Text>
      </View>

      <View style={styles.rightColumn}>
        <Text style={styles.reviewTitle}>Review:</Text>
        <Text style={styles.comment}>{object.comentario}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 20,
    flexWrap: 'wrap',
    padding: 12,
  },
  leftColumn: {
    flex: 1,
    gap: 8,
  },
  rightColumn: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  basicInfo: {
    color: '#ccc',
    fontSize: 14,
  },
  director: {
    color: '#aaa',
  },
  rating: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  synopsisContainer: {
    marginTop: 12,
  },
  description: {
    color: 'white',
    marginBottom: 6,
  },
  extraInfo: {
    color: '#bbb',
  },
  reviewEmail: {
    marginTop: 32,
    fontStyle: 'italic',
    color: '#ccc',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  comment: {
    color: '#ddd',
    fontSize: 15,
  },
});
