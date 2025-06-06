import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMyListStore } from "../../store/useUserStore";

export default function ListaFilmesPage() {
  const { myList, removeMyList } = useMyListStore()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Lista</Text>

      {myList.length === 0 ? (
        <Text style={styles.empty}>Nenhum filme adicionado a sua lista!.</Text>
      ) : (
        <FlatList
          data={myList}
          keyExtractor={(item) => item.objectId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.posterUrl }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.titulo}</Text>
                <TouchableOpacity onPress={() => removeMyList(item.objectId)}>
                  <Ionicons name="trash-outline" size={24} color="#ff5555" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700", 
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E", 
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flexShrink: 1,
  },
  empty: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 40,
    textAlign: "center",
  },
});
