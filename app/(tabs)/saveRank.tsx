// pages/RankingView.tsx
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React = require("react");

interface Ranking {
  username: string;
  first: string;
  second: string;
  third: string;
  posters: string[];
}

export default function RankingView() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    const fetchFromBack4App = async () => {
      const res = await fetch(
        `https://parseapi.back4app.com/classes/Rank?limit=10&skip=${
          (paginaAtual - 1) * 10
        }&order=-createdAt`,
        {
          headers: {
            "X-Parse-Application-Id":
              "GwnUACA5KJuULzj5Pf30JZhwXU0lkeu43Z1wnDoN",
            "X-Parse-REST-API-Key": "8wYzUlStyJkZFCgAh1aHHy035JPU1e8wNhgRtBqp",
          },
        }
      );

      const data = await res.json();
      const enriched = await Promise.all(
        data.results.map(async (ranking: any) => {
          const filmes = ["first", "second", "third"];
          const posters = await Promise.all(
            filmes.map(async (pos) => {
              const apiKey = "ec406f50";
              const res = await fetch(
                `https://www.omdbapi.com/?t=${encodeURIComponent(
                  ranking[pos]
                )}&apikey=${apiKey}`
              );
              const data = await res.json();
              return data.Poster !== "N/A" ? data.Poster : null;
            })
          );
          return { ...ranking, posters };
        })
      );

      setRankings(enriched);
    };

    fetchFromBack4App();
  }, [paginaAtual]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar Rankings</Text>
      <FlatList
        data={rankings}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.username}>{item.username || "anônimo"}</Text>
              <Text style={styles.likes}>👍 0</Text>
            </View>
            <View style={styles.filmsContainer}>
              {item.posters.map((poster, idx) => (
                <View key={idx} style={styles.filmPick}>
                  <Text style={styles.pos}>
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                  </Text>
                  {poster && (
                    <Image
                      source={{ uri: poster }}
                      style={[styles.poster, idx === 0 ? styles.gold : idx === 1 ? styles.silver : styles.bronze]}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      />
      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={paginaAtual === 1}
          onPress={() => setPaginaAtual((p) => p - 1)}
          style={[styles.pageButton, paginaAtual === 1 && styles.disabled]}
        >
          <Text>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pageLabel}>Página {paginaAtual}</Text>
        <TouchableOpacity
          onPress={() => setPaginaAtual((p) => p + 1)}
          style={styles.pageButton}
        >
          <Text>Próxima</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#151718",
  },
  title: {
    fontSize: 45,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 20,
    color: "#FFD700",
  },
  card: {
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    color: "#facc15",
  },
  likes: {
    fontSize: 16,
    color: "#22c55e",
  },
  filmsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  filmPick: {
    alignItems: "center",
  },
  pos: {
    fontSize: 20,
    marginBottom: 5,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
  },
  gold: {
    borderWidth: 2,
    borderColor: "#facc15",
  },
  silver: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  bronze: {
    borderWidth: 2,
    borderColor: "#f97316",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 20,
  },
  pageButton: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  pageLabel: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#333",
  },
});