import { Image, StyleSheet, Text, View } from 'react-native';
import DescritivoInicial from '../components/DescritivoInicial';

export const options = {
  tabBarStyle: { display: 'none' }, 
};


export default function HomeScreen() {
  return (
    <View style={{alignItems: 'center'}}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bem vindo ao CineApp</Text>
        <Text style={styles.description}>Avalie filmes e séries. Compartilhe suas opiniões e veja o que outros acharam também!</Text>
      </View>
        <Image
          source={require('@/assets/images/pipoca.png')}
          style={styles.pipocaCard}
        />
        <DescritivoInicial/>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 60,
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  pipocaCard: {
    marginTop: 30,
    height: 178,
    width: 230,
  },
  title: {
    color: '#FFD700',
    fontSize: 55,
    textAlign: 'center',
    fontWeight: 600
  },
  description: {
    maxWidth: 360,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 8
  }
});
