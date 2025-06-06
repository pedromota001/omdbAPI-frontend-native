import { useMyListStore } from '@/store/useUserStore';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DescritivoCardExpandido from '../DescritivoCardExpandido';

const CardExpandido = ({ object, onClick }: { object: any; onClick: (id: string) => void }) => {
  const onHandleClick = () => {
    onClick(object.objectId);
  };

  const { addMyList, removeMyList, isMyList } = useMyListStore();
  const ItemMyList = isMyList(object.objectId);

  const onClickMyListButton = () => {
    ItemMyList ? removeMyList(object.objectId) : addMyList({
      objectId: object.objectId,
      titulo: object.titulo,
      posterUrl: object.posterUrl,
      notaIMDB: object.notaIMDB
    })
  }

  if (!object) {
    return <Text style={styles.loading}>Carregando dados...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: object.posterUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.likeButton} onPress={onHandleClick}>
          <FontAwesome name="heart-o" size={20} color="red" style={{marginLeft: 10}} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.favButton} onPress={onClickMyListButton}>
        <FontAwesome name={ItemMyList ? 'bookmark' : 'plus-square'} size={24} color="#E50914" />
        <Text style={styles.favText}>
          {ItemMyList ? 'Remover da minha lista' : 'Adicionar à minha lista'}
        </Text>
      </TouchableOpacity>

      <View style={styles.description}>
        <DescritivoCardExpandido object={object} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingTop: 70,
    gap: 12,
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 16,
    marginRight: 10,
  },
  likeButton: {
    marginTop: 8,
    padding: 4,
    alignSelf: 'flex-start',
  },
  description: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#E50914',
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 12,
  },
  favText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
})


export default CardExpandido