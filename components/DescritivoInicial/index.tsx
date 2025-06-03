import { StyleSheet, Text, View } from "react-native"
import Botao from "../Botao"

const DescritivoInicial = () => {
    return(
        <View>
            <Text style={styles.optionText}>Qual a opção pra hoje?</Text>
            <Botao name='Séries' href='series'/>
            <Botao name='Filmes' href='filmes'/>
            <Botao name='Ranks' href='/ranks'/>
            <Botao name='Cadastro de ranks' href='/saveRank'/>
        </View>

    )
}

const styles = StyleSheet.create({
    optionText: {
        marginTop: 20,
        color: 'white',
        fontSize: 30,
        fontWeight: 600
    }
})

export default DescritivoInicial