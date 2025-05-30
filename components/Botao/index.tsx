import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


type BtnProps = {
    name: string;
    href: string;
};

const Botao = ({name, href}: BtnProps) => {
    return(
        <View>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push(href)}>
                <Text style={styles.btnPrimaryText}>{name}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    btnPrimary: {
        backgroundColor: '#D50000',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
        alignItems: 'center',
        marginVertical: 10,
    },
    btnPrimaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 500
    }

})

export default Botao