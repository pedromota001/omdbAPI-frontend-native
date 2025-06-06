// app/ranking.tsx
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React = require("react");

export default function Ranking() {
  const [posters, setPosters] = useState({ first: '', second: '', third: '' });
  const [titles, setTitles] = useState({ first: '', second: '', third: '' });
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPoster = async (title: string, position: keyof typeof posters) => {
    const apiKey = "ec406f50";
    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
    const data = await res.json();
    if (data.Response === "True") {
      setPosters(prev => ({ ...prev, [position]: data.Poster }));
    } else {
      Alert.alert("Not found", "Movie not found. Try again.");
    }
  };

  const handleSave = async (name: string) => {
    const payload = {
      first: titles.first,
      second: titles.second,
      third: titles.third,
      username: name,
    };

    try {
      const res = await fetch("https://parseapi.back4app.com/classes/Rank", {
        method: "POST",
        headers: {
          "X-Parse-Application-Id": "GwnUACA5KJuULzj5Pf30JZhwXU0lkeu43Z1wnDoN",
          "X-Parse-REST-API-Key": "8wYzUlStyJkZFCgAh1aHHy035JPU1e8wNhgRtBqp",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        Alert.alert("Ranking saved!", `Thanks ${name}!`);
      } else {
        Alert.alert("Error", "Could not save ranking.");
      }
    } catch (err) {
      Alert.alert("Error", "Unexpected error occurred.");
    } finally {
      setModalVisible(false);
    }
  };

  const renderPodium = (label: string, position: keyof typeof posters, borderColor: string) => (
    <View style={styles.podiumItem}>
      {posters[position] ? (
        <Image source={{ uri: posters[position] }} style={styles.poster} />
      ) : null}
      <Text style={[styles.position, { color: borderColor }]}>{label}</Text>
      <TextInput
        placeholder={`${label} Place`}
        placeholderTextColor="#aaa"
        style={[styles.input, { borderBottomColor: borderColor }]}
        value={titles[position]}
        onChangeText={text => setTitles(prev => ({ ...prev, [position]: text }))}
        onSubmitEditing={() => fetchPoster(titles[position], position)}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crie seu Ranking</Text>

      <View style={styles.podiumRow}>
        {renderPodium("2nd", "second", "#e5e7eb")}
        {renderPodium("1st", "first", "#facc15")}
        {renderPodium("3rd", "third", "#f97316")}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.saveText}>Salvar</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Qual o seu nome?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Optional"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#aaa"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => handleSave(username || "Anonymous")}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#151718",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 20,
    color: "#FFD700"
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  podiumItem: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  position: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    borderBottomWidth: 2,
    fontSize: 16,
    width: "80%",
    textAlign: "center",
    marginBottom: 12,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#1f2937",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    color: "#22c55e",
    fontWeight: "bold",
  },
  cancelText: {
    color: "#fa2415",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: "#2c2c2c",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
